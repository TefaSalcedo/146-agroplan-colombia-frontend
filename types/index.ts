export type Suitability = "high" | "medium" | "low" | "none"

export type RecommendationLevel = "high" | "medium" | "low"

export interface Weather {
  temperature: number
  condition: string
  humidity: number
  precipitation: number
  icon: "sun" | "cloud" | "rain" | "partly"
}

export interface Location {
  municipality: string
  department: string
  altitude: number
}

export interface GrowthStage {
  label: string
  icon: "seed" | "sprout" | "leaf" | "flower" | "harvest"
  description: string
}

export interface Tip {
  title: string
  description: string
}

export interface Crop {
  id: string
  name: string
  scientificName: string
  image: string
  successRate: number
  recommendation: RecommendationLevel
  shortReason: string
  reason: string
  daysToHarvest: number
  soilType: string
  idealTemperature: string
  humidity: string
  precipitation: string
  altitude: string
  irrigation: string
  substrates: string[]
  plantingMonths: number[]
  harvestMonths: number[]
  stages: GrowthStage[]
  tips: Tip[]
}

export interface Municipality {
  id: string
  name: string
  department: string
  lat: number
  lng: number
  altitude: number
  avgTemperature: number
  precipitation: number
  /** suitability per crop id */
  suitability: Record<string, Suitability>
}

export interface ClimateAlert {
  id: string
  level: "info" | "warning" | "danger"
  title: string
  description: string
}

export interface CalendarDay {
  day: number
  rating: "ideal" | "acceptable" | "notRecommended"
}
