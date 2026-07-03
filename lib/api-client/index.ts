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

// Unified API object for convenience
export const api = {
  municipalities: {
    list: (department?: string) => (await import("./municipalities")).fetchMunicipalities(department),
    get: (id: string) => (await import("./municipalities")).fetchMunicipality(id),
    departments: () => (await import("./municipalities")).fetchDepartments(),
  },
  weather: {
    get: (municipalityId: string) => (await import("./weather")).fetchWeather(municipalityId),
  },
  crops: {
    list: () => (await import("./crops")).fetchCrops(),
    get: (id: string) => (await import("./crops")).fetchCrop(id),
    lite: () => (await import("./crops")).fetchCropsLite(),
  },
  zoning: {
    predict: (request: any) => (await import("./zoning")).predictZoning(request),
  },
  calendars: {
    predict: (request: any) => (await import("./calendars")).predictCalendar(request),
  },
  recommendations: {
    get: (municipalityId: string) => (await import("./recommendations")).fetchRecommendations(municipalityId),
  },
  health: {
    check: () => (await import("./health")).fetchHealth(),
  },
}
