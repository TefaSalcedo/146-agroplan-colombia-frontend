"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useLocation } from "@/context/LocationContext"

export function CropDownloadButtons({ cropName }: { cropName: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const { selectedLocation } = useLocation()

  async function handlePdfDownload() {
    setIsLoading(true)
    try {
      if (!selectedLocation) {
        throw new Error('Selecciona un municipio antes de generar el PDF')
      }

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${cropName.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`
      const pagePath = pathname || '/cultivos'

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

      toast.success('PDF descargado', { description: filename })
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
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handlePdfDownload}
        disabled={isLoading}
        className="flex-1 min-w-40"
        size="lg"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileText className="size-4" />
        )}
        {isLoading ? 'Generando...' : 'Descargar PDF'}
      </Button>
    </div>
  )
}
