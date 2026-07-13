import { NextRequest, NextResponse } from 'next/server'
import chromium from '@sparticuz/chromium-min'
import puppeteer from 'puppeteer-core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const CHROMIUM_PACK_URL =
  'https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar'

export async function POST(request: NextRequest) {
  const { page = '/cultivos', filename = 'documento.pdf', location } = await request.json()

  if (typeof page !== 'string' || !page.startsWith('/')) {
    console.error('[PDF API] Invalid page path:', page)
    return NextResponse.json({ error: 'Invalid page path' }, { status: 400 })
  }

  const host = request.headers.get('host') || 'localhost:3000'
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim()
  const protocol = forwardedProtocol || new URL(request.url).protocol.replace(':', '')
  const url = `${protocol}://${host}${page}`

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
      executablePath: await chromium.executablePath(CHROMIUM_PACK_URL),
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
    await browserPage.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
    console.log('[PDF API] Page loaded, waiting for complete state')
    await browserPage.waitForFunction(() => document.readyState === 'complete')

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
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    if (browser) {
      console.log('[PDF API] Closing browser...')
      await browser.close()
      console.log('[PDF API] Browser closed')
    }
  }
}
