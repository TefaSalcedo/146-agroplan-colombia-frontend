'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { CropCard } from '@/components/crop-card'
import { DownloadPdfButton } from '@/components/download-pdf-button'
import { PageLoading } from '@/components/page-loading'
import { useRecommendations } from '@/hooks'
import { useLocation } from '@/context/LocationContext'
import { buildLocationPath } from '@/lib/routing'
import type { Crop } from '@/types'

export default function CultivosPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const { selectedLocation } = useLocation()

  const municipalityId = selectedLocation?.id || ''
  const { recommendations, loading, error } = useRecommendations(municipalityId)

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
        <PageHeader
          title='Cultivos'
          subtitle={`Cultivos recomendados para ${selectedLocation.name}, ${selectedLocation.department}`}
        />
        <DownloadPdfButton pageName='Cultivos-AgroPlan' />
      </div>
      <div
        id='pdf-cultivos'
        className='grid grid-cols-2 gap-4 rounded-lg bg-white p-6 sm:grid-cols-3 lg:grid-cols-4'
      >
        {cropCards.map((crop) => (
          <CropCard key={crop.id} {...crop} href={`${cropsBasePath}/${crop.id}`} />
        ))}
      </div>
    </div>
  )
}
