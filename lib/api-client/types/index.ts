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
  departmentsDetailed?: DepartmentDTO[]
  count?: number
}

export interface DepartmentDTO {
  daneCode: string
  name: string
  municipalityCount: number
}

export interface MunicipalityDTO {
  id: string
  name: string
  department: string
  departmentId?: string
  daneCode?: string
  lat: number
  lng: number
  altitude: number
  avgTemperature?: number
  precipitation?: number
  area?: number
  areaKm2?: number
  regionNatural?: string
  thermalFloor?: string
  climateZone?: string
  distanceKm?: number
}

export interface MunicipalitySearchResponse {
  query: string
  results: MunicipalitySearchResult[]
  count: number
}

export interface MunicipalitySearchResult {
  id: string
  municipalityId?: string
  name: string
  type: "municipality" | "department"
  departmentId?: string
  departmentName?: string
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
  method?: string | null
  probabilities?: Record<string, number> | null
  warnings?: string[] | null
  cacheHit?: boolean | null
}



export interface ZoningBatchCropResult {
  cropId: string
  cropName: string
  suitability: "high" | "medium" | "low" | "none"
  confidence: number
  modelVersion: string
  method?: string
  factors: ZoningFactors
  probabilities?: Record<string, number> | null
  warnings?: string[] | null
}

export interface ClimateBasedRecommendation {
  cropId: string
  cropName: string
  score: number
  source: string
}

export interface ZoningBatchResponse {
  municipalityId: string
  municipalityName: string
  results: ZoningBatchCropResult[]
  climateBasedRecommendations: ClimateBasedRecommendation[]
  modelVersion: string
}

export interface ZoningMapMunicipalityResult {
  municipalityId: string
  municipalityName: string
  daneCode: string
  lat: number
  lng: number
  suitability: "high" | "medium" | "low" | "none"
  confidence: number
  method?: string
  probabilities?: Record<string, number> | null
}

export interface ZoningMapResponse {
  cropId: string
  cropName: string
  modelVersion: string
  method?: string
  results: ZoningMapMunicipalityResult[]
  totalMunicipalities?: number
  cacheHit?: boolean | null
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

export interface CalendarBatchRequest {
  municipality_id: string
  crop_ids?: string[] | null
  horizon_months?: number
}

export interface CalendarMonthlyForecast {
  month: number
  year: number
  tempMean?: number | null
  precipitation?: number | null
  humidity?: number | null
  climateSource: "open_meteo_forecast" | "not_available"
}

export interface CalendarHarvestWindow {
  harvestMonth: number
  harvestYear: number
  harvestMonthName: string
  score: number
  plantingMonths: number[]
  plantingYear?: number | null
  durationDaysMin?: number | null
  durationDaysMax?: number | null
}

export interface CalendarCropExplanation {
  text: string | null
  status: string
  provider: string | null
  model: string | null
  tokensIn: number | null
  tokensOut: number | null
  tokensTotal: number | null
  latencyMs: number | null
  error: string | null
}

export interface CalendarCropResult {
  cropId: string
  cropName: string
  yieldPrediction?: number | null
  yieldModelVersion?: string | null
  yieldConfidence?: "high" | "medium" | "low" | null
  topHarvestMonths: CalendarHarvestWindow[]
  monthlyForecasts: CalendarMonthlyForecast[]
  warnings: string[]
  method?: string
  explanation: CalendarCropExplanation
}

export interface CalendarBatchResponse {
  municipalityId: string
  municipalityName: string
  horizonMonths: number
  results: CalendarCropResult[]
  modelVersion: string
}

// ==================== Recommendations ====================

export interface RecommendationRequest {
  municipality_id: string
}

export interface CropRecommendationResponse {
  cropId: string
  cropName: string
  municipalityId: string
  municipalityName: string
  text: string
  provider: string | null
  model: string | null
  tokensIn: number | null
  tokensOut: number | null
  tokensTotal: number | null
  latencyMs: number | null
  status: string
  error: string | null
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
  source: "data" | "climate" | "fallback"
}

// ==================== Alerts ====================

export interface AlertResponse {
  id: string
  level: "info" | "warning" | "danger"
  title: string
  description: string
}

export interface AlertsResponse {
  municipalityId: string
  alerts: AlertResponse[]
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

export interface ForecastResponse {
  municipalityId: string
  forecast: ForecastDayResponse[]
}

export type ForecastTrend =
  | "warmer"
  | "cooler"
  | "wetter"
  | "drier"
  | "warmer_drier"
  | "warmer_wetter"
  | "cooler_drier"
  | "cooler_wetter"
  | "normal"

export interface MonthlyForecastItem {
  forecastMonth: string
  monthName: string
  tempMean: number
  tempAnomaly: number
  precipitation: number
  precipitationAnomaly: number
  trend: ForecastTrend
  source: string
  fetchedAt: string
}

export interface MonthlyForecastResponse {
  municipalityId: string
  municipalityName: string
  months: number
  model: string
  forecasts: MonthlyForecastItem[]
  note: string
}

// ==================== Health ====================

export interface HealthResponse {
  status: string
  version: string
  modelsLoaded: boolean
}

export interface ComponentStatus {
  name: string
  ready: boolean
  detail?: string | null
}

export interface ReadinessResponse {
  status: string
  version: string
  components: ComponentStatus[]
}

// ==================== Admin ====================

export interface ClimateSyncStatusResponse {
  enabled: boolean
  lastSyncAt: string | null
  nextSyncAt: string | null
  status: string
  syncedMunicipalities: number
  totalMunicipalities: number
}

export interface ModelsStatusResponse {
  loaded: boolean
  models: Record<string, {
    loaded: boolean
    version: string
    loadedAt: string | null
  }>
}

export interface CacheStatsResponse {
  totalEntries: number
  hits: number
  misses: number
  hitRate: number
  sizeBytes: number
  entriesByType: Record<string, number>
}

export interface CacheInvalidateRequest {
  prediction_type?: "zoning" | "calendar" | null
  municipality_id?: string | null
  crop_id?: string | null
}

export interface CacheInvalidateResponse {
  success: boolean
  invalidatedCount: number
  message: string
}

export interface PredictionRunResponse {
  id: string
  timestamp: string
  predictionType: string
  municipalityId: string
  cropId?: string | null
  duration: number
  success: boolean
  cacheHit: boolean
  method: string
  errorMessage?: string | null
}
