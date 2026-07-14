import { createHash, randomUUID } from 'node:crypto'
import { createReadStream, createWriteStream } from 'node:fs'
import { access, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'
import { extract } from 'tar-fs'

interface PdfLocation {
  id: string
  name: string
  department: string
  lat: number
  lng: number
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar'
const CHROMIUM_PACK_SHA256 =
  '8732cf776aa7d51a3d921de6882e7ef27a51b392e2735579aa517546f4ed7c33'
const CHROMIUM_PACK_DIR = join(tmpdir(), 'agroplan-chromium-pack-v149')
const CHROMIUM_VERIFIED_MARKER = join(CHROMIUM_PACK_DIR, '.verified')
const MAX_REQUEST_BYTES = 64 * 1024
const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 3
const MAX_CONCURRENT_PDFS = 2

const requestLog = new Map<string, number[]>()
let activePdfCount = 0
let chromiumExecutablePromise: Promise<string> | undefined
type PdfLogger = (message: string, details?: unknown) => void

async function getChromiumExecutablePath(log: PdfLogger): Promise<string> {
  chromiumExecutablePromise ??= (async () => {
    try {
      await access(CHROMIUM_VERIFIED_MARKER)
      const executablePath = await chromium.executablePath(CHROMIUM_PACK_DIR)
      log('Reusing verified Chromium cache', { executablePath })
      return executablePath
    } catch {
      // The temporary cache is only trusted after this process verifies the archive.
      log('Verified Chromium cache not available; downloading artifact')
    }

    const archivePath = join(tmpdir(), 'agroplan-chromium-v149.tar')
    const downloadStartedAt = Date.now()
    const response = await fetch(CHROMIUM_PACK_URL, {
      signal: AbortSignal.timeout(300_000),
    })
    log('Chromium artifact response received', {
      status: response.status,
      elapsedMs: Date.now() - downloadStartedAt,
    })
    if (!response.ok || !response.body) {
      throw new Error(`Unable to download Chromium pack: HTTP ${response.status}`)
    }

    await pipeline(
      Readable.fromWeb(
        response.body as unknown as import('node:stream/web').ReadableStream<Uint8Array>,
      ),
      createWriteStream(archivePath),
    )
    log('Chromium artifact downloaded', { elapsedMs: Date.now() - downloadStartedAt })

    const hash = createHash('sha256')
    await pipeline(createReadStream(archivePath), hash)
    const actualHash = hash.digest('hex')
    log('Chromium artifact hash calculated', { actualHash })
    if (actualHash !== CHROMIUM_PACK_SHA256) {
      await rm(archivePath, { force: true })
      throw new Error('Chromium pack integrity check failed')
    }

    await rm(CHROMIUM_PACK_DIR, { force: true, recursive: true })
    await rm(join(tmpdir(), 'chromium'), { force: true })
    await mkdir(CHROMIUM_PACK_DIR, { recursive: true })
    await pipeline(createReadStream(archivePath), extract(CHROMIUM_PACK_DIR))
    await rm(archivePath, { force: true })
    log('Chromium artifact extracted', { directory: CHROMIUM_PACK_DIR })

    const chromiumPath = await chromium.executablePath(CHROMIUM_PACK_DIR)
    await writeFile(CHROMIUM_VERIFIED_MARKER, CHROMIUM_PACK_SHA256, 'utf8')
    log('Chromium executable ready', { executablePath: chromiumPath })
    return chromiumPath
  })().catch((error) => {
    chromiumExecutablePromise = undefined
    throw error
  })

  return chromiumExecutablePromise
}

function getTrustedOrigin(): string {
  const configuredOrigin =
    process.env.PDF_ORIGIN ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  const origin = new URL(configuredOrigin)

  if (!['http:', 'https:'].includes(origin.protocol)) {
    throw new Error('PDF_ORIGIN must use HTTP or HTTPS')
  }
  if (process.env.VERCEL && origin.protocol !== 'https:') {
    throw new Error('PDF_ORIGIN must use HTTPS on Vercel')
  }

  return origin.origin
}

function getClientKey(request: NextRequest): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() ||
    'unknown'
  )
}

function consumeRateLimit(clientKey: string): boolean {
  const now = Date.now()
  const recentRequests = (requestLog.get(clientKey) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  )
  if (requestLog.size > 10_000) {
    for (const [key, timestamps] of requestLog) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) {
        requestLog.delete(key)
      }
    }
  }

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(clientKey, recentRequests)
    return false
  }

  recentRequests.push(now)
  requestLog.set(clientKey, recentRequests)
  return true
}

function isPrintablePath(page: string): boolean {
  return /^\/[a-z0-9-]+\/[a-z0-9-]+\/(?:inicio|calendario|cultivos)$/.test(page)
}

function sanitizeFilename(filename: unknown): string {
  if (typeof filename !== 'string') return 'documento.pdf'

  const sanitized = filename
    .slice(0, 120)
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '')

  if (!sanitized) return 'documento.pdf'
  return sanitized.toLowerCase().endsWith('.pdf') ? sanitized : `${sanitized}.pdf`
}

function isValidLocation(location: unknown): location is PdfLocation {
  if (!location || typeof location !== 'object') return false

  const candidate = location as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length <= 100 &&
    typeof candidate.name === 'string' &&
    candidate.name.length <= 150 &&
    typeof candidate.department === 'string' &&
    candidate.department.length <= 150 &&
    typeof candidate.lat === 'number' &&
    Number.isFinite(candidate.lat) &&
    candidate.lat >= -90 &&
    candidate.lat <= 90 &&
    typeof candidate.lng === 'number' &&
    Number.isFinite(candidate.lng) &&
    candidate.lng >= -180 &&
    candidate.lng <= 180
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getPrintableSelector(page: string): string {
  if (page.endsWith('/inicio')) return '#pdf-content'
  if (page.endsWith('/calendario')) return '#pdf-calendario'
  if (page.endsWith('/cultivos')) return '#pdf-cultivos'
  return 'main'
}

export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || randomUUID()
  const requestStartedAt = Date.now()
  const log: PdfLogger = (message, details) => {
    console.log(`[PDF API][${requestId}] ${message}`, details ?? '')
  }
  const logError = (message: string, error?: unknown) => {
    console.error(`[PDF API][${requestId}] ${message}`, error ?? '')
  }

  log('Request received', {
    method: request.method,
    contentType: request.headers.get('content-type'),
    contentLength: request.headers.get('content-length'),
    activePdfCount,
  })

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_REQUEST_BYTES) {
    log('Request rejected: body too large', { contentLength, maxBytes: MAX_REQUEST_BYTES })
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    log('Request rejected: invalid content type')
    return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 })
  }

  const clientKey = getClientKey(request)
  if (!consumeRateLimit(clientKey)) {
    log('Request rejected: rate limit exceeded')
    return NextResponse.json({ error: 'Too many PDF requests' }, { status: 429 })
  }

  if (activePdfCount >= MAX_CONCURRENT_PDFS) {
    log('Request rejected: concurrency limit exceeded', { maxConcurrent: MAX_CONCURRENT_PDFS })
    return NextResponse.json({ error: 'PDF service is busy' }, { status: 503 })
  }

  let body: unknown
  try {
    const rawBody = await request.text()
    const bodyBytes = new TextEncoder().encode(rawBody).byteLength
    if (bodyBytes > MAX_REQUEST_BYTES) {
      log('Request rejected: body exceeds actual size limit', {
        bodyBytes,
        maxBytes: MAX_REQUEST_BYTES,
      })
      return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
    }
    body = JSON.parse(rawBody)
  } catch {
    log('Request rejected: invalid JSON')
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!isRecord(body)) {
    log('Request rejected: body is not an object')
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const page = body.page ?? '/cultivos'
  const requestedFilename = body.filename ?? 'documento.pdf'
  const location = body.location

  if (location !== undefined && !isValidLocation(location)) {
    log('Request rejected: invalid location payload')
    return NextResponse.json({ error: 'Invalid location payload' }, { status: 400 })
  }

  if (
    typeof requestedFilename !== 'string' ||
    requestedFilename.length === 0 ||
    requestedFilename.length > 120
  ) {
    log('Request rejected: invalid filename')
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }
  const filename = sanitizeFilename(requestedFilename)

  if (
    typeof page !== 'string' ||
    !page.startsWith('/') ||
    page.startsWith('//') ||
    /[\u0000-\u001f\u007f]/.test(page)
  ) {
    logError('Request rejected: invalid page path', page)
    return NextResponse.json({ error: 'Invalid page path' }, { status: 400 })
  }

  if (!isPrintablePath(page)) {
    logError('Request rejected: unsupported printable path', page)
    return NextResponse.json({ error: 'Unsupported printable path' }, { status: 400 })
  }

  const origin = getTrustedOrigin()
  const url = `${origin}${page}`
  activePdfCount += 1

  log('Starting PDF generation', {
    page,
    url,
    filename,
    activePdfCount,
  })
  if (location) {
    log('Location provided', {
      id: location.id,
      name: location.name,
      department: location.department,
    })
  }

  const startTime = Date.now()
  let browser

  try {
    log('Launching Puppeteer browser')
    const chromiumPath = await getChromiumExecutablePath(log)
    log('Using Chromium executable', { chromiumPath })
    browser = await puppeteer.launch({
      args: await puppeteer.defaultArgs({
        args: chromium.args,
        headless: 'shell',
      }),
      executablePath: chromiumPath,
      headless: 'shell',
    })
    log('Browser launched successfully')

    const browserPage = await browser.newPage()
    log('Created browser page')
    // Keep responsive layouts in their desktop state while generating the PDF.
    await browserPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
    await browserPage.emulateMediaType('screen')
    log('Configured desktop viewport', { width: 1440, height: 1000 })

    // Seed Zustand's persisted location before loading the route.
    if (location) {
      log('Injecting location into localStorage')
      await browserPage.evaluateOnNewDocument((locationData) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(
            'selectedLocation',
            JSON.stringify({ state: { selectedLocation: locationData }, version: 0 }),
          )
        }
      }, location)
    }

    log('Navigating to page', { url })
    const navigationStartedAt = Date.now()
    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    log('Navigation completed', { elapsedMs: Date.now() - navigationStartedAt })

    const printableSelector = getPrintableSelector(page)
    log('Waiting for printable selector', { printableSelector })
    await browserPage.waitForSelector(printableSelector, { timeout: 25000 })
    log('Printable selector found', { printableSelector })

    log('Waiting briefly for background requests')
    await browserPage
      .waitForNetworkIdle({
        concurrency: 2,
        idleTime: 500,
        timeout: 5000,
      })
      .then(() => log('Background request wait completed'))
      .catch((error: unknown) => {
        log('Background requests remain active; continuing with rendered content', {
          errorName: error instanceof Error ? error.name : 'UnknownError',
          errorMessage: error instanceof Error ? error.message : String(error),
        })
      })

    log('Waiting for fonts and images')
    await browserPage.evaluate(async () => {
      await document.fonts.ready
      const pendingImages = Promise.all(
        Array.from(document.images)
          .filter((image) => !image.complete)
          .map((image) => new Promise<void>((resolve) => {
            image.addEventListener('load', () => resolve(), { once: true })
            image.addEventListener('error', () => resolve(), { once: true })
          })),
      )
      await Promise.race([
        pendingImages,
        new Promise<void>((resolve) => window.setTimeout(resolve, 3000)),
      ])
    })
    log('Fonts and images readiness wait completed')

    // Hide interactive elements that should not appear in the PDF.
    log('Applying PDF-specific styles')
    await browserPage.addStyleTag({
      content: `
        [data-pdf-hide], [aria-label="Navegación principal"], nav[aria-label="Navegación principal"], .fixed { display: none !important; }
        main { padding-bottom: 0 !important; }
      `,
    })
    await browserPage.evaluate(() => {
      const desktopGridColumns = [
        ['lg:grid-cols-[320px_1fr]', '360px minmax(0, 1fr)'],
        ['lg:grid-cols-[1fr_220px]', 'minmax(0, 1fr) 260px'],
        ['lg:grid-cols-2', 'repeat(2, minmax(0, 1fr))'],
      ] as const

      document.querySelectorAll<HTMLElement>('[class*="lg:grid-cols"]').forEach((element) => {
        const match = desktopGridColumns.find(([className]) => element.classList.contains(className))
        if (match) {
          element.style.setProperty('grid-template-columns', match[1], 'important')
        }
      })
    })
    log('PDF-specific styles applied')

    log('Generating PDF buffer')
    const pdfBuffer = await browserPage.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      preferCSSPageSize: true,
    })
    log('PDF generated successfully', {
      sizeBytes: pdfBuffer.length,
      elapsedMs: Date.now() - requestStartedAt,
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
    logError('PDF generation failed', {
      elapsedSeconds: totalTime,
      elapsedMs: Date.now() - requestStartedAt,
      errorName: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 },
    )
  } finally {
    activePdfCount = Math.max(0, activePdfCount - 1)
    log('PDF request finished', {
      elapsedMs: Date.now() - requestStartedAt,
      activePdfCount,
      browserClosed: Boolean(browser),
    })
    if (browser) {
      log('Closing browser')
      await browser.close()
      log('Browser closed')
    }
  }
}
