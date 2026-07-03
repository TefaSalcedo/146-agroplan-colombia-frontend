import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function generatePDF(elementId: string, filename: string): Promise<void> {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`)
    }

    console.log('[v0] Starting PDF generation for:', filename)

    // Create a clone of the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement
    clonedElement.style.padding = '20px'
    clonedElement.style.backgroundColor = '#ffffff'
    
    // Temporarily add to DOM for rendering
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '-9999px'
    tempContainer.style.width = 'a4'
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)

    try {
      // Capture the element as canvas with more compatible settings
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        windowWidth: 800,
        windowHeight: 1200,
        // Disable some problematic features that cause lab() color parsing
        foreignObjectRendering: false,
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      
      // Create PDF with proper settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10
      const imgWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = margin

      // Add first page with image
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - margin * 2

      // Add additional pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight)
        heightLeft -= pageHeight - margin * 2
      }

      // Add metadata
      pdf.setProperties({
        title: filename.replace('.pdf', ''),
        subject: 'AgroPlan Colombia - Reporte Agrícola',
        author: 'AgroPlan Colombia',
        creator: 'AgroPlan',
      })

      // Save/download the PDF
      pdf.save(filename)
      console.log('[v0] PDF downloaded successfully:', filename)
    } finally {
      // Clean up temporary element
      document.body.removeChild(tempContainer)
    }
  } catch (error) {
    console.error('[v0] Error generating PDF:', error)
    throw error
  }
}
