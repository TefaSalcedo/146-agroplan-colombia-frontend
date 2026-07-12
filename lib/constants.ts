// UI constants and presentation helpers used across the app.
// These are not data; they are localization/formatting helpers.

export const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
]

export const MONTHS_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export const suitabilityColors: Record<string, string> = {
  high: "#4a9d5b",
  medium: "#e0b955",
  low: "#d98d54",
  none: "#b8b8b0",
}

export const mapSuitabilityColors: Record<string, string> = {
  high: "#4a9d5b",
  medium: "#e0b955",
  low: "#d98d54",
  none: "#b8b8b0",
}

export function getSuitabilityLabel(s: string): string {
  switch (s) {
    case "high":
      return "Aptitud alta"
    case "medium":
      return "Aptitud media"
    case "low":
      return "Aptitud baja"
    default:
      return "No apta"
  }
}

export function getRecommendationLabel(r: string): string {
  switch (r) {
    case "high":
      return "Muy recomendado"
    case "medium":
      return "Recomendado"
    default:
      return "Poco recomendado"
  }
}
