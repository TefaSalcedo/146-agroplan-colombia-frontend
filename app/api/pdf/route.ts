import { createHash } from 'node:crypto'
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

async function getChromiumExecutablePath(): Promise<string> {
  chromiumExecutablePromise ??= (async () => {
    try {
      await access(CHROMIUM_VERIFIED_MARKER)
      return chromium.executablePath(CHROMIUM_PACK_DIR)
    } catch {
      // The temporary cache is only trusted after this process verifies the archive.
    }

    const archivePath = join(tmpdir(), 'agroplan-chromium-v149.tar')
    const response = await fetch(CHROMIUM_PACK_URL, {
      signal: AbortSignal.timeout(300_000),
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

    const hash = createHash('sha256')
    await pipeline(createReadStream(archivePath), hash)
    const actualHash = hash.digest('hex')
    if (actualHash !== CHROMIUM_PACK_SHA256) {
      await rm(archivePath, { force: true })
      throw new Error('Chromium pack integrity check failed')
    }

    await rm(CHROMIUM_PACK_DIR, { force: true, recursive: true })
    await rm(join(tmpdir(), 'chromium'), { force: true })
    await mkdir(CHROMIUM_PACK_DIR, { recursive: true })
    await pipeline(createReadStream(archivePath), extract(CHROMIUM_PACK_DIR))
    await rm(archivePath, { force: true })

    const chromiumPath = await chromium.executablePath(CHROMIUM_PACK_DIR)
    await writeFile(CHROMIUM_VERIFIED_MARKER, CHROMIUM_PACK_SHA256, 'utf8')
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

function getPrintableSelector(page: string): string {
  if (page.endsWith('/inicio')) return '#pdf-content'
  if (page.endsWith('/calendario')) return '#pdf-calendario'
  if (page.endsWith('/cultivos')) return '#pdf-cultivos'
  return 'main'
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || 0)
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
  }

  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 })
  }

  const clientKey = getClientKey(request)
  if (!consumeRateLimit(clientKey)) {
    return NextResponse.json({ error: 'Too many PDF requests' }, { status: 429 })
  }

  if (activePdfCount >= MAX_CONCURRENT_PDFS) {
    return NextResponse.json({ error: 'PDF service is busy' }, { status: 503 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const payload = body as Record<string, unknown>
  const page = payload.page ?? '/cultivos'
  const filename = sanitizeFilename(payload.filename)
  const location = payload.location

  if (location !== undefined && !isValidLocation(location)) {
    return NextResponse.json({ error: 'Invalid location payload' }, { status: 400 })
  }

  if (typeof page !== 'string' || !page.startsWith('/')) {
    console.error('[PDF API] Invalid page path:', page)
    return NextResponse.json({ error: 'Invalid page path' }, { status: 400 })
  }

  if (!isPrintablePath(page)) {
    console.error('[PDF API] Unsupported printable path:', page)
    return NextResponse.json({ error: 'Unsupported printable path' }, { status: 400 })
  }

  const url = `${getTrustedOrigin()}${page}`
  activePdfCount += 1

  console.log(`[PDF API] Starting PDF generation for page: ${page}`)
  console.log(`[PDF API] URL: ${url}`)
  console.log(`[PDF API] Filename: ${filename}`)
  if (location) {
    console.log(`[PDF API] Location provided: ${location.name}, ${location.department}`)
  }

  const startTime = Date.now()
  let browser

  try {
    console.log('[PDF API] Launching Puppeteer browser...')
    browser = await puppeteer.launch({
      args: await puppeteer.defaultArgs({
        args: chromium.args,
        headless: 'shell',
      }),
      executablePath: await getChromiumExecutablePath(),
      headless: 'shell',
    })
    console.log('[PDF API] Browser launched successfully')

    const browserPage = await browser.newPage()
    // Keep responsive layouts in their desktop state while generating the PDF.
    await browserPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
    await browserPage.emulateMediaType('screen')
    console.log('[PDF API] Created new page')

    // Seed Zustand's persisted location before loading the route.
    if (location) {
      console.log('[PDF API] Injecting location into localStorage')
      await browserPage.evaluateOnNewDocument((locationData) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(
            'selectedLocation',
            JSON.stringify({ state: { selectedLocation: locationData }, version: 0 }),
          )
        }
      }, location)
    }

    console.log(`[PDF API] Navigating to ${url}...`)
    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

    const printableSelector = getPrintableSelector(page)
    console.log(`[PDF API] Waiting for printable content: ${printableSelector}`)
    await browserPage.waitForSelector(printableSelector, { timeout: 25000 })

    // The application has long-lived background requests (sidebar data and map tiles).
    // Waiting for networkidle0 would block until the navigation timeout despite the
    // printable content already being rendered.
    await browserPage.waitForNetworkIdle({
      concurrency: 2,
      idleTime: 500,
      timeout: 5000,
    }).catch(() => {
      console.warn('[PDF API] Background requests are still active; continuing with rendered content')
    })

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

    // Hide interactive elements that should not appear in the PDF.
    console.log('[PDF API] Applying PDF-specific styles (hiding navigation, buttons)')
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

    console.log('[PDF API] Generating PDF buffer...')
    const pdfBuffer = await browserPage.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      preferCSSPageSize: true,
    })

    const pdfSizeKB = (pdfBuffer.length / 1024).toFixed(2)
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log(`[PDF API] PDF generated successfully`)
    console.log(`[PDF API] PDF size: ${pdfSizeKB} KB`)
    console.log(`[PDF API] Total time: ${totalTime}s`)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error(`[PDF API] PDF generation failed after ${totalTime}s:`, error)
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
    if (browser) {
      console.log('[PDF API] Closing browser...')
      await browser.close()
      console.log('[PDF API] Browser closed')
    }
  }
}
