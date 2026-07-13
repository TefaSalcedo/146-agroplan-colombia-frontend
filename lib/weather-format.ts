export function formatPrecipitation(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return "--"
  }

  const rounded = Math.round(value * 10) / 10
  return `${rounded}mm`
}
