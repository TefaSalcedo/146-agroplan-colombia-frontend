'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { MapPin } from 'lucide-react'
import { LocationSelectorModal } from "./location-selector-modal"

export function MobileTopbar() {
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedLocation')
      if (stored) {
        const location = JSON.parse(stored)
        setCurrentLocation(`${location.name}`)
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Image src="/logo.webp" alt="AgroPlan" width={32} height={32} className="size-8 rounded-xl object-cover" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">AgroPlan Colombia</p>
          </div>
        </div>
        <button
          onClick={() => setIsLocationOpen(true)}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-primary/10 active:scale-95"
          aria-label="Cambiar ubicación"
        >
          <MapPin className="size-4 text-primary transition-transform duration-200 group-hover:scale-110" />
          {currentLocation && <span className="text-xs font-medium text-muted-foreground">{currentLocation}</span>}
        </button>
      </header>
      <LocationSelectorModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  )
}
