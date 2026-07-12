'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Database, Cloud } from 'lucide-react'
import { PageHeader } from '@/components/page-header'
import { CropCard } from '@/components/crop-card'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { PageLoading } from '@/components/page-loading'
import { useRecommendations, useAiInsights } from '@/hooks'
import { useLocation } from '@/context/LocationContext'
import { AiInsightsPanel } from '@/components/ai-insights-panel'
import { RecommendationSourceBanner } from '@/components/recommendation-source-banner'
import { buildLocationPath } from '@/lib/routing'
import type { CropResponseLite } from '@/lib/api-client/types'

function toCropCard(crop: CropResponseLite) {
  return {
    id: crop.id,
    name: crop.name,
    image: crop.image,
    recommendation: crop.recommendation,
    successRate: crop.successRate,
  }
}

interface CropGridProps {
  crops: CropResponseLite[]
  basePath: string
  emptyMessage?: string
}

function CropGrid({ crops, basePath, emptyMessage }: CropGridProps) {
  if (crops.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {emptyMessage || 'No hay cultivos para mostrar en esta sección.'}
      </p>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
      {crops.map((crop) => (
        <CropCard key={crop.id} {...toCropCard(crop)} href={`${basePath}/${crop.id}`} />
      ))}
    </div>
  )
}

export default function CultivosPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation } = useLocation()

  const municipalityId = selectedLocation?.id || ''
  const { recommendations, loading, error } = useRecommendations(municipalityId)
  const { insights, loading: insightsLoading, error: insightsError, retryAttempt: insightsRetryAttempt, reload: reloadInsights } = useAiInsights(municipalityId)

  useEffect(() => {
    setMounted(true)

    // Redirect to landing page if no location selected
    if (!selectedLocation && mounted) {
      router.push('/')
    }
  }, [selectedLocation, mounted, router])

  if (!mounted || !selectedLocation) {
    return null
  }

  if (loading) {
    return <PageLoading title='Cultivos recomendados' />
  }

  if (error) {
    return (
      <div className='flex min-h-[400px] items-center justify-center'>
        <p className='text-destructive'>Error: {error}</p>
      </div>
    )
  }

  const topCrop = recommendations?.topCrop
  const otherCrops = recommendations?.otherCrops || []
  const isMixed = recommendations?.source === 'mixed'

  const cropCards = [
    ...(topCrop ? [topCrop] : []),
    ...otherCrops,
  ].map((c) => ({
    id: c.id,
    name: c.name,
    image: c.image,
    recommendation: c.recommendation,
    successRate: c.successRate,
  }))

  const cropsBasePath = buildLocationPath(selectedLocation.department, selectedLocation.name, 'cultivos')

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <PageHeader
            title='Cultivos'
            subtitle={`Cultivos recomendados para ${selectedLocation.name}, ${selectedLocation.department}`}
          />
          {recommendations?.source && (
            <RecommendationSourceBanner
              source={recommendations.source}
              sourceDescription={recommendations.sourceDescription}
              whyItMatters={recommendations.whyItMatters}
              modelVersion={recommendations.modelVersion}
              method={recommendations.method}
            />
          )}
        </div>
        <DownloadPdfButton pageName='Cultivos-AgroPlan' />
      </div>

      {isMixed ? (
        <div id='pdf-cultivos' className='flex flex-col gap-6 rounded-lg bg-white p-6'>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Database className='size-4 text-primary' />
              <h2 className='text-base font-semibold'>Basado en datos históricos</h2>
            </div>
            <p className='text-sm text-muted-foreground'>
              Cultivos con mejor desempeño histórico en condiciones similares a las de este municipio.
            </p>
            <CropGrid
              crops={recommendations.dataBasedCrops}
              basePath={cropsBasePath}
              emptyMessage='No hay cultivos históricos disponibles.'
            />
          </div>
          <div className='flex flex-col gap-3'>
            <div className='flex items-center gap-2'>
              <Cloud className='size-4 text-sky-600' />
              <h2 className='text-base font-semibold'>Basado en predicción climática</h2>
            </div>
            <p className='text-sm text-muted-foreground'>
              Cultivos que se adaptan mejor según el pronóstico climático actual (modelo KNN).
            </p>
            <CropGrid
              crops={recommendations.climateBasedCrops}
              basePath={cropsBasePath}
              emptyMessage='No hay cultivos climáticos disponibles.'
            />
          </div>
        </div>
      ) : (
        <div
          id='pdf-cultivos'
          className='grid grid-cols-2 gap-4 rounded-lg bg-white p-6 sm:grid-cols-3 lg:grid-cols-4'
        >
          {cropCards.map((crop) => (
            <CropCard key={crop.id} {...crop} href={`${cropsBasePath}/${crop.id}`} />
          ))}
        </div>
      )}
      <AiInsightsPanel
        insights={insights}
        loading={insightsLoading}
        error={insightsError}
        retryAttempt={insightsRetryAttempt}
        municipalityName={selectedLocation.name}
        onReload={() => reloadInsights()}
      />
    </div>
  )
}
