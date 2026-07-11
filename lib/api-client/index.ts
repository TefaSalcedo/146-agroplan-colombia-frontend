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
    list: async (department?: string) => (await import("./municipalities")).fetchMunicipalities(department),
    get: async (id: string) => (await import("./municipalities")).fetchMunicipality(id),
    departments: async () => (await import("./municipalities")).fetchDepartments(),
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
  },
  calendars: {
    predict: async (request: any) => (await import("./calendars")).predictCalendar(request),
  },
  recommendations: {
    get: async (municipalityId: string) => (await import("./recommendations")).fetchRecommendations(municipalityId),
  },
  health: {
    check: async () => (await import("./health")).fetchHealth(),
  },
}
