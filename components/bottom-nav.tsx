"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/nav"
import { buildNavHref } from "@/lib/routing"
import { Settings, Trophy } from "lucide-react"
import { useLocation } from "@/context/LocationContext"

export function BottomNav() {
  const pathname = usePathname()
  const { selectedLocation } = useLocation()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-card/95 backdrop-blur md:hidden"
      aria-label="Navegación principal"
    >
      {navItems.map((item) => {
        const segment = item.href.replace(/^\//, '')
        const href = buildNavHref(selectedLocation, segment)
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
      {[
        { label: "Concurso", href: "/concurso", icon: Trophy },
        { label: "Configuración", href: "/configuracion", icon: Settings },
      ].map((item) => {
        const active = pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className="size-5" />
            <span className="truncate">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
