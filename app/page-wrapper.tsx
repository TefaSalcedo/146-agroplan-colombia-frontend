'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LandingPage } from '@/components/landing-page'
import { useLocation } from '@/context/LocationContext'
import { buildLocationPath } from '@/lib/routing'

export function PageWrapper() {
  const router = useRouter()
  const { selectedLocation } = useLocation()

  useEffect(() => {
    if (selectedLocation) {
      router.push(buildLocationPath(selectedLocation.department, selectedLocation.name, 'inicio'))
    }
  }, [selectedLocation, router])

  return <LandingPage />
}
