import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar'

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
  const body = await request.json().catch(() => null)
  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const page = body.page ?? '/cultivos'
  const filename = body.filename ?? 'documento.pdf'
  const location = body.location

  if (typeof filename !== 'string' || filename.length === 0 || filename.length > 120) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  if (
    typeof page !== 'string' ||
    !page.startsWith('/') ||
    page.startsWith('//') ||
    /[\u0000-\u001f\u007f]/.test(page)
  ) {
    console.error('[PDF API] Invalid page path:', page)
    return NextResponse.json({ error: 'Invalid page path' }, { status: 400 })
  }

  const origin = new URL(request.url).origin
  const url = `${origin}${page}`
  const safeFilename = filename.replace(/[\r\n"]/g, '_')

  const startTime = Date.now()
  let browser

  try {
    browser = await puppeteer.launch({
      args: await puppeteer.defaultArgs({
        args: chromium.args,
        headless: 'shell',
      }),
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
      headless: 'shell',
    })

    const browserPage = await browser.newPage()
    // Keep responsive layouts in their desktop state while generating the PDF.
    await browserPage.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 })
    await browserPage.emulateMediaType('screen')

    // Seed Zustand's persisted location before loading the route.
    if (location) {
      await browserPage.evaluateOnNewDocument((locationData) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(
            'selectedLocation',
            JSON.stringify({ state: { selectedLocation: locationData }, version: 0 }),
          )
        }
      }, location)
    }

    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

    const printableSelector = getPrintableSelector(page)
    await browserPage.waitForSelector(printableSelector, { timeout: 25000 })

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

    const pdfBuffer = await browserPage.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      preferCSSPageSize: true,
    })

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
      },
    })
  } catch (error) {
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error(`[PDF API] PDF generation failed after ${totalTime}s:`, error)
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
