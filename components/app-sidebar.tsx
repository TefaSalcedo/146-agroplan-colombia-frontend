"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/nav"
import { MapPin } from "lucide-react"
import Image from "next/image"
import { LocationSelectorModal } from "./location-selector-modal"

export function AppSidebar() {
  const pathname = usePathname()
  const [isLocationOpen, setIsLocationOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedLocation')
      if (stored) {
        const location = JSON.parse(stored)
        setCurrentLocation(`${location.name}, ${location.department}`)
      }
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary transition-transform duration-200 hover:scale-105">
            <Image src="/logo.webp" alt="AgroPlan" width={40} height={40} className="size-10 rounded-2xl object-cover" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sidebar-foreground">AgroPlan</p>
            <p className="text-xs text-muted-foreground">Colombia</p>
          </div>
        </div>

        {currentLocation && (
          <button
            onClick={() => setIsLocationOpen(true)}
            className="mx-3 mb-4 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 transition-all duration-200 hover:bg-primary/15 active:scale-95"
            aria-label="Cambiar ubicación"
          >
            <MapPin className="size-4 text-primary" />
            <div className="text-left text-xs">
              <p className="text-muted-foreground">Ubicación</p>
              <p className="font-medium text-sidebar-foreground">{currentLocation.split(',')[0]}</p>
            </div>
          </button>
        )}

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2" aria-label="Navegación principal">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95",
                active
                  ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1",
              )}
            >
              <Icon className={cn("size-5 shrink-0 transition-transform duration-200", active && "scale-110")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-6">
        <p className="text-xs text-muted-foreground text-pretty">
          Datos al Ecosistema 2026 · Zonificación agroclimática con IA
        </p>
      </div>
      </aside>
      <LocationSelectorModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
    </>
  )
}
