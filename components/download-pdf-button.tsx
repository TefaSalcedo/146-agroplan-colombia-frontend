'use client'

import { useState } from 'react'
import { FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generatePDF } from '@/lib/pdf-generator'

interface DownloadPdfButtonProps {
  pageName: string
  contentId?: string
  className?: string
}

export function DownloadPdfButton({ pageName, contentId = 'main', className }: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${pageName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`
      await generatePDF(contentId, filename)
    } catch (error) {
      console.error('[v0] Error downloading PDF:', error)
      alert(`Error al generar PDF: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className={`gap-2 transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 disabled:opacity-50 ${className || ''}`}
      aria-label={`Descargar reporte de ${pageName}`}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FileDown className="size-4 transition-transform duration-200 group-hover:scale-110" />
      )}
      {isLoading ? 'Generando...' : 'Descargar'}
    </Button>
  )
}
