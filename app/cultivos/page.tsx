import type { Metadata } from 'next'
import { PageHeader } from "@/components/page-header"
import { CropCard } from "@/components/crop-card"
import { DownloadPdfButton } from "@/components/download-pdf-button"
import { crops, extraCrops } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: 'Cultivos Recomendados | Guía Completa de Siembra | AgroPlan Colombia',
  description: 'Fichas detalladas de cultivos recomendados para Colombia. Información sobre siembra, cosecha, clima óptimo y zonificación agrícola de cada cultivo.',
  keywords: 'cultivos Colombia, guía siembra, calendarios agrícolas, zonificación cultivos, recomendaciones agrícolas',
}

export default function CultivosPage() {
  const all = [
    ...crops.map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      recommendation: c.recommendation,
      successRate: c.successRate,
    })),
    ...extraCrops,
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Cultivos"
          subtitle="Elige un cultivo para ver su ficha completa: siembra, cosecha, clima y consejos."
        />
        <DownloadPdfButton pageName="Cultivos-AgroPlan" contentId="pdf-cultivos" />
      </div>
      <div id="pdf-cultivos" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 bg-white p-6 rounded-lg">
        {all.map((crop) => (
          <CropCard key={crop.id} {...crop} />
        ))}
      </div>
    </div>
  )
}
