// Re-export everything from the API client modules
import type { CalendarRequest, CacheInvalidateRequest } from "./types"

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
export * from "./ai-insights"
export * from "./admin"

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
    recommendations: async (cropId: string, municipalityId: string) =>
      (await import("./crops")).fetchCropRecommendations(cropId, municipalityId),
  },
  zoning: {
    predictBatch: async (municipalityId: string) => (await import("./zoning")).predictZoningBatch(municipalityId),
    getMap: async (cropId: string) => (await import("./zoning")).fetchZoningMap(cropId),
  },
  calendars: {
    predict: async (request: CalendarRequest) => (await import("./calendars")).predictCalendar(request),
    predictBatch: async (request: import("./types").CalendarBatchRequest) =>
      (await import("./calendars")).predictCalendarBatch(request),
  },
  recommendations: {
    get: async (municipalityId: string) => (await import("./recommendations")).fetchRecommendations(municipalityId),
  },
  aiInsights: {
    get: async (municipalityId: string) => (await import("./ai-insights")).fetchAiInsights(municipalityId),
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
  admin: {
    climateSyncStatus: async () => (await import("./admin")).fetchClimateSyncStatus(),
    modelsStatus: async () => (await import("./admin")).fetchModelsStatus(),
    cacheStats: async () => (await import("./admin")).fetchCacheStats(),
    invalidateCache: async (request?: CacheInvalidateRequest) => (await import("./admin")).invalidateCache(request),
    recentPredictionRuns: async (limit?: number) => (await import("./admin")).fetchRecentPredictionRuns(limit),
  },
}
