'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useLocation } from '@/context/LocationContext'

interface DownloadPdfButtonProps {
  pageName: string
  className?: string
}

export function DownloadPdfButton({ pageName, className }: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const { selectedLocation } = useLocation()

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      if (!selectedLocation) {
        throw new Error('Selecciona un municipio antes de generar el PDF')
      }

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${pageName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`
      const pagePath = pathname || '/inicio'

      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pagePath, filename, location: selectedLocation }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || 'Error al generar PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('PDF descargado', {
        description: filename,
      })
    } catch (error) {
      console.error('Error downloading PDF:', error)
      toast.error('Error al generar PDF', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={handleDownload}
        disabled={isLoading}
        variant="default"
        size="lg"
        className={`gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-md ${className || ''}`}
        aria-label={`Descargar reporte de ${pageName}`}
        data-pdf-hide
      >
        {isLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <FileDown className="size-5 transition-transform duration-200 group-hover:scale-110" />
        )}
        {isLoading ? 'Generando...' : 'Descargar PDF'}
      </Button>
      {isLoading && (
        <div
          className="text-xs text-muted-foreground animate-pulse"
          role="status"
          aria-live="polite"
        >
          Esto puede demorar un poco...
        </div>
      )}
    </div>
  )
}
