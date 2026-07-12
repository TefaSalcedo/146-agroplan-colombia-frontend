// Re-export everything from the API client modules
export * from "./client"
export * from "./types"
export * from "./municipalities"
export * from "./weather"
export * from "./crops"
export * from "./zoning"
export * from "./calendars"
export * from "./recommendations"
export * from "./health"
export * from "./alerts"
export * from "./forecast"

// Unified API object for convenience
export const api = {
  municipalities: {
    list: async (department?: string) => (await import("./municipalities")).fetchMunicipalities(department),
    get: async (id: string) => (await import("./municipalities")).fetchMunicipality(id),
    departments: async () => (await import("./municipalities")).fetchDepartments(),
    nearby: async (lat: number, lng: number, maxDistanceKm?: number) =>
      (await import("./municipalities")).fetchNearbyMunicipality(lat, lng, maxDistanceKm),
    search: async (query: string, limit?: number) =>
      (await import("./municipalities")).searchMunicipalities(query, limit),
  },
  weather: {
    get: async (municipalityId: string) => (await import("./weather")).fetchWeather(municipalityId),
  },
  crops: {
    list: async () => (await import("./crops")).fetchCrops(),
    get: async (id: string) => (await import("./crops")).fetchCrop(id),
    lite: async () => (await import("./crops")).fetchCropsLite(),
  },
  zoning: {
    predict: async (request: any) => (await import("./zoning")).predictZoning(request),
    predictBatch: async (request: any) => (await import("./zoning")).predictZoningBatch(request),
    getMap: async (cropId: string) => (await import("./zoning")).fetchZoningMap(cropId),
  },
  calendars: {
    predict: async (request: any) => (await import("./calendars")).predictCalendar(request),
    predictBatch: async (request: any) => (await import("./calendars")).predictCalendarBatch(request),
  },
  recommendations: {
    get: async (municipalityId: string) => (await import("./recommendations")).fetchRecommendations(municipalityId),
  },
  alerts: {
    list: async (municipalityId: string) => (await import("./alerts")).fetchAlerts(municipalityId),
  },
  forecast: {
    daily: async (municipalityId: string, days?: number) =>
      (await import("./forecast")).fetchDailyForecast(municipalityId, days),
  },
  health: {
    check: async () => (await import("./health")).fetchHealth(),
    readiness: async () => (await import("./health")).fetchReadiness(),
  },
}
