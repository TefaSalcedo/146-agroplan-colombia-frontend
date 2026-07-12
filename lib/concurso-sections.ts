import { Award, GitBranch, Calendar, Users, Heart, type LucideIcon } from "lucide-react"

export type ConcursoSection =
  | "que-es"
  | "nuestro-proyecto"
  | "como-lo-hicimos"
  | "nuestro-equipo"
  | "software-libre"

export interface ConcursoSectionConfig {
  id: ConcursoSection
  label: string
  icon: LucideIcon
}

export const concursoSections: ConcursoSectionConfig[] = [
  { id: "que-es", label: "Datos al ecosistema 2026", icon: Award },
  { id: "nuestro-proyecto", label: "Nuestro Proyecto", icon: GitBranch },
  { id: "como-lo-hicimos", label: "Cómo lo hicimos", icon: Calendar },
  { id: "nuestro-equipo", label: "Nuestro equipo", icon: Users },
  { id: "software-libre", label: "Software libre", icon: Heart },
]

export function isValidConcursoSection(value: string | null): value is ConcursoSection {
  return concursoSections.some((s) => s.id === value)
}

export function getConcursoSection(value: string | null): ConcursoSection {
  return isValidConcursoSection(value) ? value : "que-es"
}
