/**
 * Convert a human-readable name into a URL-safe route segment.
 * Accents are removed, non-alphanumeric characters become hyphens,
 * and consecutive/leading/trailing hyphens are collapsed.
 */
export function formatRouteName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Build a slash-separated path for a given department + municipality.
 * Example: buildLocationPath("Antioquia", "Medellín", "cultivos")
 *          -> "/antioquia/medellin/cultivos"
 */
export function buildLocationPath(
  department: string,
  municipality: string,
  ...segments: string[]
): string {
  const base = `/${formatRouteName(department)}/${formatRouteName(municipality)}`
  if (segments.length === 0) return base
  const rest = segments.map((s) => encodeURIComponent(s)).join("/")
  return `${base}/${rest}`
}

interface LocationLike {
  department: string
  name: string
}

/**
 * Build a navigation href for a nav segment when a location is selected.
 * Falls back to the landing page when no location is available.
 */
export function buildNavHref(
  location: LocationLike | null | undefined,
  segment: string,
): string {
  if (!location) return '/'
  return buildLocationPath(location.department, location.name, segment)
}

export function isCropDetailPath(pathname: string): boolean {
  return /^\/[^/]+\/[^/]+\/cultivos\/[^/]+$/.test(pathname)
}
