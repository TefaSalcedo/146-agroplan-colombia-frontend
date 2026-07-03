'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FileDown, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface DownloadPdfButtonProps {
  pageName: string
  className?: string
}

export function DownloadPdfButton({ pageName, className }: DownloadPdfButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${pageName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`
      const pagePath = pathname || '/inicio'

      const storedLocation = typeof window !== 'undefined' ? sessionStorage.getItem('selectedLocation') : null
      const location = storedLocation ? JSON.parse(storedLocation) : undefined

      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pagePath, filename, location }),
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
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className={`gap-2 transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 disabled:opacity-50 ${className || ''}`}
      aria-label={`Descargar reporte de ${pageName}`}
      data-pdf-hide
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
