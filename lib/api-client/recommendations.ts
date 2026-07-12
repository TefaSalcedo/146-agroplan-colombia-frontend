import { fetchApi } from "./client"
import { fetchCrops } from "./crops"
import type { RecommendationResponse, ZoningBatchResponse } from "./types"
import type { Crop, RecommendationLevel, Suitability } from "@/types"
import { MONTHS_LONG } from "@/lib/constants"

interface RankedCrop {
  result: import("./types").ZoningBatchResponse["results"][number]
  crop: Crop
  score: number
}

function suitabilityScore(suitability: Suitability): number {
  switch (suitability) {
    case "high":
      return 3
    case "medium":
      return 2
    case "low":
      return 1
    case "none":
    default:
      return 0
  }
}

function successRateFromSuitability(
  suitability: Suitability,
  confidence: number
): number {
  const base =
    suitability === "high" ? 0.9 : suitability === "medium" ? 0.78 : suitability === "low" ? 0.6 : 0.25
  return Math.round(base * (0.95 + confidence * 0.05) * 100)
}

function recommendationLevelFromSuitability(suitability: Suitability): RecommendationLevel {
  if (suitability === "none") return "low"
  return suitability
}

function nextPlantingMonth(plantingMonths: number[]): number {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  const sorted = [...plantingMonths].sort((a, b) => a - b)
  for (const month of sorted) {
    if (month >= currentMonth) {
      return month
    }
  }

  return sorted[0] ?? currentMonth
}

function buildRecommendationResponse(
  zoning: ZoningBatchResponse,
  crops: Crop[]
): RecommendationResponse {
  const cropMap = new Map<string, Crop>()
  for (const crop of crops) {
    cropMap.set(crop.id, crop)
  }

  const ranked = zoning.results
    .map((result) => {
      const crop = cropMap.get(result.cropId)
      if (!crop) return null
      return {
        result,
        crop,
        score: suitabilityScore(result.suitability),
      }
    })
    .filter((item): item is RankedCrop => item !== null)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return b.result.confidence - a.result.confidence
    })

  const top = ranked[0]
  const alternatives = ranked.slice(1, 5)

  const topSuitability = top?.result.suitability ?? "high"
  const topConfidence = top?.result.confidence ?? 0.75
  const topCrop = top
    ? {
        ...top.crop,
        suitability: topSuitability,
        recommendation: recommendationLevelFromSuitability(topSuitability),
        successRate: successRateFromSuitability(topSuitability, topConfidence),
      }
    : crops[0]
      ? {
          ...crops[0],
          suitability: "high" as Suitability,
          recommendation: "high" as RecommendationLevel,
          successRate: successRateFromSuitability("high", 0.75),
        }
      : undefined

  if (!topCrop) {
    throw new Error("No crop data available")
  }

  const otherCrops = alternatives.map((item) => {
    const suitability = item.result.suitability
    return {
      id: item.crop.id,
      name: item.crop.name,
      image: item.crop.image,
      recommendation: recommendationLevelFromSuitability(suitability),
      successRate: successRateFromSuitability(suitability, item.result.confidence),
    }
  })

  const topPlantingMonths = topCrop.plantingMonths.length > 0 ? topCrop.plantingMonths : [8]
  const month = nextPlantingMonth(topPlantingMonths)

  return {
    topCrop,
    otherCrops,
    nextPlantingSeason: {
      month,
      monthName: MONTHS_LONG[month - 1] ?? MONTHS_LONG[7],
      crops: [topCrop.id, ...otherCrops.slice(0, 2).map((c) => c.id)],
    },
  }
}

export async function fetchRecommendations(
  municipalityId: string
): Promise<RecommendationResponse> {
  const [zoning, crops] = await Promise.all([
    fetchApi<ZoningBatchResponse>("/zoning/recommendations", {
      method: "POST",
      body: JSON.stringify({ municipality_id: municipalityId }),
    }),
    fetchCrops(),
  ])

  return buildRecommendationResponse(zoning, crops)
}

export const recommendationsApi = {
  get: fetchRecommendations,
}
