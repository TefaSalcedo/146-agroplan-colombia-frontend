'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { MapPin, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { LocationSelectorModal } from "./location-selector-modal"
import { useLocation } from '@/context/LocationContext'

export function MobileTopbar() {
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { selectedLocation } = useLocation()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:hidden">
        <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-105">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Image src="/logo.webp" alt="AgroPlan" width={32} height={32} className="size-8 rounded-xl object-cover" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">AgroPlan Colombia</p>
          </div>
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsLocationOpen(true)}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all duration-200 hover:bg-primary/10 active:scale-95"
            aria-label="Cambiar ubicación"
          >
            <MapPin className="size-4 text-primary transition-transform duration-200 group-hover:scale-110" />
            {selectedLocation && <span className="max-w-24 truncate text-xs font-medium text-muted-foreground">{selectedLocation.name}</span>}
          </button>
        </div>
      </header>
      <LocationSelectorModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  )
}
