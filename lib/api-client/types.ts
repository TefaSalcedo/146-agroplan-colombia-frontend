import type { Crop, Municipality, Weather, Suitability, CalendarDay, RecommendationLevel } from "@/types"

// ==================== Municipalities ====================

export interface MunicipalityListResponse {
  municipalities: Municipality[]
  count: number
}

export interface DepartmentsResponse {
  departments: string[]
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

// ==================== Crops ====================

export interface CropListResponse {
  crops: Crop[]
  count: number
}

export interface CropLite {
  id: string
  name: string
  image: string
  recommendation: RecommendationLevel
  success_rate: number
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
  other_crops: CropLite[]
  next_planting_season: NextPlantingSeason
}

// ==================== Health ====================

export interface HealthResponse {
  status: string
  version: string
  models_loaded: boolean
}
