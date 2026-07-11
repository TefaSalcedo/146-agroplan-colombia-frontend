export const COLOMBIA_BOUNDS = {
  minLat: -4.5,
  maxLat: 13.6,
  minLng: -79.1,
  maxLng: -66.8,
}

export function isWithinColombia(latitude: number, longitude: number) {
  return (
    latitude >= COLOMBIA_BOUNDS.minLat &&
    latitude <= COLOMBIA_BOUNDS.maxLat &&
    longitude >= COLOMBIA_BOUNDS.minLng &&
    longitude <= COLOMBIA_BOUNDS.maxLng
  )
}
