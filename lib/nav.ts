import { Home, Map, Sprout, CalendarDays, Settings, type LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/inicio", icon: Home },
  { label: "Zonificación", href: "/zonificacion", icon: Map },
  { label: "Cultivos", href: "/cultivos", icon: Sprout },
  { label: "Calendario", href: "/calendario", icon: CalendarDays },
  { label: "Configuración", href: "/configuracion", icon: Settings },
]
