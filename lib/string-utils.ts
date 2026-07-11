/**
 * Normalize a string for case-insensitive, accent-insensitive searching.
 */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}
