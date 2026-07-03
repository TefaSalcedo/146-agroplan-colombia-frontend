'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from "@/components/page-header"
import { CropCard } from "@/components/crop-card"
import { DownloadPdfButton } from "@/components/download-pdf-button"
import { api, ApiError } from '@/lib/api'
import type { Crop } from '@/types'

export default function CultivosPage() {
  const [crops, setCrops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCrops()
  }, [])

  const loadCrops = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.crops.list()
      setCrops(data)
    } catch (err) {
      console.error('Error loading crops:', err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Error loading crops')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando cultivos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  const cropCards = crops.map((c: Crop) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    recommendation: c.recommendation,
    successRate: c.success_rate,
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Cultivos"
          subtitle="Elige un cultivo para ver su ficha completa: siembra, cosecha, clima y consejos."
        />
        <DownloadPdfButton pageName="Cultivos-AgroPlan" />
      </div>
      <div id="pdf-cultivos" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 bg-white p-6 rounded-lg">
        {cropCards.map((crop) => (
          <CropCard key={crop.id} {...crop} />
        ))}
      </div>
    </div>
  )
}
