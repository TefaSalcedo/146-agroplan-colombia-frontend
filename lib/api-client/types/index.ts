// API Types - Centralized type definitions for API requests and responses
// These types are specific to the API layer and should be used in api-client modules

// ==================== Municipalities ====================

export interface MunicipalityListResponse {
  municipalities: MunicipalityDTO[]
  count: number
}

export interface MunicipalityDTO {
  id: string
  name: string
  department: string
  lat: number
  lng: number
  altitude: number
  avg_temperature?: number
  precipitation?: number
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
  crops: CropDTO[]
  count: number
}

export interface CropDTO {
  id: string
  name: string
  image: string
  description: string
  recommendation: string
  success_rate: number
  planting_months: number[]
  optimal_altitude_min: number
  optimal_altitude_max: number
  optimal_temp_min: number
  optimal_temp_max: number
  optimal_precipitation_min: number
  optimal_precipitation_max: number
}

export interface CropResponseLite {
  id: string
  name: string
  image: string
  recommendation: string
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
  suitability: "high" | "medium" | "low" | "none"
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

export interface CalendarDay {
  day: number
  rating: "ideal" | "acceptable" | "notRecommended"
  reason?: string
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
  top_crop: CropDTO & { suitability: "high" | "medium" | "low" | "none" }
  other_crops: CropResponseLite[]
  next_planting_season: NextPlantingSeason
}

// ==================== Health ====================

export interface HealthResponse {
  status: string
  version: string
  models_loaded: boolean
}
