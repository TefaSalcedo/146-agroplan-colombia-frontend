import { Home, Map, Sprout, CalendarDays, Settings, type LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Inicio", href: "/inicio", icon: Home },
  { label: "Zonificación", href: "/inicio/zonificacion", icon: Map },
  { label: "Cultivos", href: "/inicio/cultivos", icon: Sprout },
  { label: "Calendario", href: "/inicio/calendario", icon: CalendarDays },
  { label: "Configuración", href: "/inicio/configuracion", icon: Settings },
]
