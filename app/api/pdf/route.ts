import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const { page = '/cultivos', filename = 'documento.pdf', location } = await request.json()

  if (typeof page !== 'string' || !page.startsWith('/')) {
    console.error('[PDF API] Invalid page path:', page)
    return NextResponse.json({ error: 'Invalid page path' }, { status: 400 })
  }

  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
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
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })
    console.log('[PDF API] Browser launched successfully')

    const browserPage = await browser.newPage()
    console.log('[PDF API] Created new page')

    // Inject the selected location into sessionStorage so pages like /inicio can render.
    if (location) {
      console.log('[PDF API] Injecting location into sessionStorage')
      await browserPage.evaluateOnNewDocument((locationData) => {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('selectedLocation', JSON.stringify(locationData))
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
