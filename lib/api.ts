import type { Crop, Municipality, Weather, Suitability, CalendarDay, RecommendationLevel } from "@/types"

// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// Error handling
class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public response?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// HTTP Client with proper error handling and typing
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
        errorData.detail || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred"
    )
  }
}

// ==================== Municipalities ====================

export interface MunicipalityListResponse {
  municipalities: Municipality[]
  count: number
}

export async function fetchMunicipalities(
  department?: string
): Promise<Municipality[]> {
  const params = new URLSearchParams()
  if (department) {
    params.append("department", department)
  }
  
  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await fetchApi<MunicipalityListResponse>(
    `/municipalities${query}`
  )
  
  return response.municipalities
}

export async function fetchMunicipality(
  id: string
): Promise<Municipality> {
  return fetchApi<Municipality>(`/municipalities/${id}`)
}

export async function fetchDepartments(): Promise<{ departments: string[] }> {
  return fetchApi<{ departments: string[] }>("/municipalities/departments")
}

// ==================== Weather ====================

export interface WeatherResponse {
  temperature: number
  condition: string
  humidity: number
  precipitation: number
  icon: string
  source: string
  fetched_at: string
}

export async function fetchWeather(
  municipalityId: string
): Promise<Weather> {
  const response = await fetchApi<WeatherResponse>(
    `/weather/${municipalityId}`
  )
  
  return {
    temperature: response.temperature,
    condition: response.condition,
    humidity: response.humidity,
    precipitation: response.precipitation,
    icon: response.icon,
  }
}

// ==================== Crops ====================

export interface CropListResponse {
  crops: Crop[]
  count: number
}

export async function fetchCrops(): Promise<Crop[]> {
  const response = await fetchApi<CropListResponse>("/crops")
  return response.crops
}

export async function fetchCrop(id: string): Promise<Crop> {
  return fetchApi<Crop>(`/crops/${id}`)
}

export async function fetchCropsLite(): Promise<
  Array<{
    id: string
    name: string
    image: string
    recommendation: RecommendationLevel
    success_rate: number
  }>
> {
  return fetchApi<Array<{
    id: string
    name: string
    image: string
    recommendation: RecommendationLevel
    success_rate: number
  }>>("/crops/lite")
}

// ==================== Zoning ====================

export interface ZoningRequest {
  crop_id: string
  municipality_id: string
}

export interface ZoningFactors {
  temperature_match: boolean
  precipitation_match: boolean
  soil_match: boolean
  altitude_match: boolean
}

export interface ZoningResponse {
  crop_id: string
  municipality_id: string
  suitability: Suitability
  confidence: number
  model_version: string
  factors: ZoningFactors
}

export async function predictZoning(
  request: ZoningRequest
): Promise<ZoningResponse> {
  return fetchApi<ZoningResponse>("/zoning/predict", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

// ==================== Calendars ====================

export interface CalendarRequest {
  crop_id: string
  municipality_id: string
  month: number
  year: number
}

export interface CalendarResponse {
  crop_id: string
  municipality_id: string
  month: number
  year: number
  days: CalendarDay[]
  ideal_count: number
  model_version: string
}

export async function predictCalendar(
  request: CalendarRequest
): Promise<CalendarResponse> {
  return fetchApi<CalendarResponse>("/calendars/predict", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

// ==================== Recommendations ====================

export interface RecommendationRequest {
  municipality_id: string
}

export interface NextPlantingSeason {
  month: number
  month_name: string
  crops: string[]
}

export interface RecommendationResponse {
  top_crop: Crop & { suitability: Suitability }
  other_crops: Array<{
    id: string
    name: string
    image: string
    recommendation: RecommendationLevel
    success_rate: number
  }>
  next_planting_season: NextPlantingSeason
}

export async function fetchRecommendations(
  municipalityId: string
): Promise<RecommendationResponse> {
  return fetchApi<RecommendationResponse>("/recommendations", {
    method: "POST",
    body: JSON.stringify({ municipality_id: municipalityId }),
  })
}

// ==================== Health ====================

export interface HealthResponse {
  status: string
  version: string
  models_loaded: boolean
}

export async function fetchHealth(): Promise<HealthResponse> {
  return fetchApi<HealthResponse>("/health")
}

// Export all as a single object for convenience
export const api = {
  municipalities: {
    list: fetchMunicipalities,
    get: fetchMunicipality,
    departments: fetchDepartments,
  },
  weather: {
    get: fetchWeather,
  },
  crops: {
    list: fetchCrops,
    get: fetchCrop,
    lite: fetchCropsLite,
  },
  zoning: {
    predict: predictZoning,
  },
  calendars: {
    predict: predictCalendar,
  },
  recommendations: {
    get: fetchRecommendations,
  },
  health: fetchHealth,
}

export { ApiError }
