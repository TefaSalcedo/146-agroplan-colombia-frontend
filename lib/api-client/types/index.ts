// API Types - Centralized type definitions for API requests and responses
// These types are specific to the API layer and should be used in api-client modules

import type { Crop } from "@/types"

// ==================== Municipalities ====================

export interface MunicipalityListResponse {
  municipalities: MunicipalityDTO[]
  count: number
}

export interface DepartmentsResponse {
  departments: string[]
}

export interface MunicipalityDTO {
  id: string
  name: string
  department: string
  lat: number
  lng: number
  altitude: number
  avgTemperature?: number
  precipitation?: number
  distanceKm?: number
}

// ==================== Weather ====================

export interface WeatherResponse {
  temperature: number
  condition: string
  humidity: number
  precipitation: number
  icon: string
  source: string
  fetchedAt: string
}

// ==================== Crops ====================

export interface CropListResponse {
  crops: Crop[]
  count: number
}

export type CropResponseLite = Pick<
  Crop,
  "id" | "name" | "image" | "recommendation" | "successRate"
>

/** Backward-compatible alias used by several hooks and fallback data. */
export type CropLite = CropResponseLite

export type CropDTO = Crop

// ==================== Zoning ====================

export interface ZoningRequest {
  crop_id: string
  municipality_id: string
}

export interface ZoningFactors {
  temperatureMatch: boolean
  precipitationMatch: boolean
  soilMatch: boolean
  altitudeMatch: boolean
}

export interface ZoningResponse {
  cropId: string
  municipalityId: string
  suitability: "high" | "medium" | "low" | "none"
  confidence: number
  modelVersion: string
  factors: ZoningFactors
}

export interface ZoningBatchRequest {
  crop_id: string
}

export interface ZoningBatchResponse {
  crop_id: string
  predictions: ZoningResponse[]
  count: number
  model_version: string
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
  cropId: string
  municipalityId: string
  month: number
  year: number
  days: CalendarDay[]
  idealCount: number
  modelVersion: string
}

// ==================== Recommendations ====================

export interface RecommendationRequest {
  municipalityId: string
}

export interface NextPlantingSeason {
  month: number
  monthName: string
  crops: string[]
}

export interface RecommendationResponse {
  topCrop: Crop & { suitability: "high" | "medium" | "low" | "none" }
  otherCrops: CropResponseLite[]
  nextPlantingSeason: NextPlantingSeason
}

// ==================== Alerts ====================

export interface AlertResponse {
  id: string
  level: "info" | "warning" | "danger"
  title: string
  description: string
}

// ==================== Forecast ====================

export interface ForecastDayResponse {
  date: string
  tempMin: number | null
  tempMax: number | null
  tempMean: number | null
  precipitation: number | null
  humidity: number | null
  uvIndex: number | null
  windSpeed: number | null
}

// ==================== Health ====================

export interface HealthResponse {
  status: string
  version: string
  modelsLoaded: boolean
}
