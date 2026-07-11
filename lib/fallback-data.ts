import { crops, municipalities, currentWeather, extraCrops, MONTHS_LONG } from "./mock-data"
import type { Weather, Crop, Municipality } from "@/types"
import type {
  RecommendationResponse,
  CropLite,
  CalendarResponse,
  ZoningResponse,
} from "./api-client/types"

export function getFallbackMunicipality(id: string): Municipality | undefined {
  return municipalities.find((m) => m.id === id)
}

export function getFallbackMunicipalities(department?: string): Municipality[] {
  if (department) {
    return municipalities.filter((m) => m.department === department)
  }
  return municipalities
}

export function getFallbackDepartments(): string[] {
  return Array.from(new Set(municipalities.map((m) => m.department)))
}

export function getFallbackCrops(): Crop[] {
  return crops
}

export function getFallbackWeather(): Weather {
  return currentWeather
}

export function getFallbackRecommendations(municipalityId: string): RecommendationResponse {
  const municipality = getFallbackMunicipality(municipalityId)
  const fallbackSuitability = municipality?.suitability ?? {}

  // pick top crop by success rate (fallback on first if no match)
  const topCropBase = crops.reduce((best, crop) => {
    const bestRate = best.successRate ?? 0
    const cropRate = crop.successRate ?? 0
    return cropRate > bestRate ? crop : best
  }, crops[0])

  const otherCrops: CropLite[] = [...crops.filter((c) => c.id !== topCropBase.id), ...extraCrops]
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      recommendation: c.recommendation,
      successRate: c.successRate ?? 0,
    }))

  const topPlanting = topCropBase.plantingMonths[0] ?? 8

  return {
    topCrop: {
      ...topCropBase,
      suitability: (fallbackSuitability[topCropBase.id] as any) ?? "high",
    },
    otherCrops,
    nextPlantingSeason: {
      month: topPlanting,
      monthName: MONTHS_LONG[topPlanting - 1] ?? MONTHS_LONG[7],
      crops: [topCropBase.id, ...otherCrops.slice(0, 2).map((c) => c.id)],
    },
  }
}

export function getFallbackCalendar(
  municipalityId: string,
  cropId: string,
  month: number,
  year: number,
): CalendarResponse {
  const crop = crops.find((c) => c.id === cropId) ?? crops[0]
  const days = []
  for (let day = 1; day <= 30; day++) {
    const seed = municipalityId.length + cropId.length + month + day + year
    const value = Math.abs(Math.sin(seed * 12.9898 + day * 78.233) * 43758.5453) % 1
    let rating: "ideal" | "acceptable" | "notRecommended"
    if (value > 0.6) rating = "ideal"
    else if (value > 0.3) rating = "acceptable"
    else rating = "notRecommended"
    days.push({ day, rating })
  }
  return {
    cropId,
    municipalityId,
    month,
    year,
    days,
    idealCount: days.filter((d) => d.rating === "ideal").length,
    modelVersion: "fallback-1.0",
  }
}

export function getFallbackZoning(municipalityId: string, cropId: string): ZoningResponse {
  const municipality = getFallbackMunicipality(municipalityId)
  const suitability = municipality?.suitability[cropId] ?? "none"
  return {
    cropId,
    municipalityId,
    suitability,
    confidence: 0.75,
    modelVersion: "fallback-1.0",
    factors: {
      temperatureMatch: true,
      precipitationMatch: true,
      soilMatch: true,
      altitudeMatch: true,
    },
  }
}
