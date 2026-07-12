import { Home, Sprout, CalendarDays, Settings, Trophy, type LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Dashboard municipio", href: "/inicio", icon: Home },
  { label: "Cultivos", href: "/cultivos", icon: Sprout },
  { label: "Calendario", href: "/calendario", icon: CalendarDays },
  { label: "Configuración", href: "/configuracion", icon: Settings },
]
