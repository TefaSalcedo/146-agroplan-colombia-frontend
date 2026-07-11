'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Municipality } from '@/types'

interface LocationContextType {
  selectedLocation: Municipality | null
  setSelectedLocation: (location: Municipality | null) => void
  clearLocation: () => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setSelectedLocationState] = useState<Municipality | null>(null)

  // Load location from browser storage on mount and keep both stores in sync.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selectedLocation') ?? sessionStorage.getItem('selectedLocation')
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Municipality
          setSelectedLocationState(parsed)
          localStorage.setItem('selectedLocation', JSON.stringify(parsed))
          sessionStorage.setItem('selectedLocation', JSON.stringify(parsed))
        } catch (error) {
          console.error('Error parsing stored location:', error)
        }
      }
    }
  }, [])

  const setSelectedLocation = (location: Municipality | null) => {
    setSelectedLocationState(location)
    if (typeof window !== 'undefined') {
      if (location) {
        const serialized = JSON.stringify(location)
        localStorage.setItem('selectedLocation', serialized)
        sessionStorage.setItem('selectedLocation', serialized)
      } else {
        localStorage.removeItem('selectedLocation')
        sessionStorage.removeItem('selectedLocation')
      }
    }
  }

  const clearLocation = () => {
    setSelectedLocation(null)
  }

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
