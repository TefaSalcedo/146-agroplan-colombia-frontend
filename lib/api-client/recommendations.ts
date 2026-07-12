import { fetchApi } from "./client"
import { fetchCrops } from "./crops"
import type { ClimateBasedRecommendation, CropResponseLite, RecommendationResponse, ZoningBatchResponse, ZoningBatchCropResult } from "./types"
import type { Crop, RecommendationLevel, Suitability } from "@/types"
import { MONTHS_LONG } from "@/lib/constants"

interface ProcessedCrop {
  crop: Crop
  modelValue: number
  method: string
}

function suitabilityFromScore(score: number): Suitability {
  if (score >= 0.7) return "high"
  if (score >= 0.4) return "medium"
  return "low"
}

function recommendationLevelFromScore(score: number): RecommendationLevel {
  const level = suitabilityFromScore(score)
  return level === "none" ? "low" : level
}

function percentageFromModelValue(modelValue: number): number {
  return Number((modelValue * 100).toFixed(2))
}

function nextPlantingMonth(plantingMonths: number[]): number {
  const today = new Date()
  const currentMonth = today.getMonth() + 1

  const sorted = [...plantingMonths].sort((a, b) => a - b)
  for (const month of sorted) {
    if (month >= currentMonth) {
      return month
    }
  }

  return sorted[0] ?? currentMonth
}

function toCropResponseLite(item: ProcessedCrop): CropResponseLite {
  return {
    id: item.crop.id,
    name: item.crop.name,
    image: item.crop.image,
    recommendation: recommendationLevelFromScore(item.modelValue),
    successRate: percentageFromModelValue(item.modelValue),
  }
}

function processDataBasedResults(
  results: ZoningBatchCropResult[],
  cropMap: Map<string, Crop>
): ProcessedCrop[] {
  return results
    .flatMap((result) => {
      const crop = cropMap.get(result.cropId)
      if (!crop) return []
      return [
        {
          crop,
          modelValue: result.confidence,
          method: result.method ?? "zoning_model",
        },
      ]
    })
    .sort((a, b) => b.modelValue - a.modelValue)
}

function processClimateRecommendations(
  recommendations: ClimateBasedRecommendation[],
  cropMap: Map<string, Crop>
): ProcessedCrop[] {
  return recommendations
    .flatMap((result) => {
      if (typeof result.escort !== "number" || !Number.isFinite(result.escort)) return []

      const crop = cropMap.get(result.cropId)
      if (!crop) return []
      return [
        {
          crop,
          modelValue: result.escort,
          method: result.source ?? "climate_forecast",
        },
      ]
    })
    .sort((a, b) => b.modelValue - a.modelValue)
}

function mergeSources(dataBased: ProcessedCrop[], climateBased: ProcessedCrop[]): ProcessedCrop[] {
  const seen = new Set<string>()
  const merged: ProcessedCrop[] = []

  for (const item of dataBased) {
    if (!seen.has(item.crop.id)) {
      seen.add(item.crop.id)
      merged.push(item)
    }
  }

  for (const item of climateBased) {
    if (!seen.has(item.crop.id)) {
      seen.add(item.crop.id)
      merged.push(item)
    }
  }

  return merged
}

function buildRecommendationResponse(
  zoning: ZoningBatchResponse,
  crops: Crop[]
): RecommendationResponse {
  const cropMap = new Map<string, Crop>()
  for (const crop of crops) {
    cropMap.set(crop.id, crop)
  }

  const dataBased = processDataBasedResults(zoning.results ?? [], cropMap)
  const climateBased = processClimateRecommendations(zoning.climateBasedRecommendations ?? [], cropMap)
  const hasResults = dataBased.length > 0
  const hasClimate = climateBased.length > 0

  let ranked: ProcessedCrop[] = []
  let source: RecommendationResponse["source"] = "fallback"

  if (hasResults && hasClimate) {
    ranked = mergeSources(dataBased, climateBased)
    source = "mixed"
  } else if (hasResults) {
    ranked = dataBased
    source = "data"
  } else if (hasClimate) {
    ranked = climateBased
    source = "climate"
  }

  const top = ranked[0]
  const alternatives = ranked.slice(1, 5)

  const modelVersion = zoning.modelVersion ?? "unknown"
  const method = source === "mixed"
    ? "zoning_model + climate_forecast"
    : top?.method ?? (source === "data" ? "zoning_model" : source === "climate" ? "climate_forecast" : "unknown")

  const topCrop = top
    ? {
        ...top.crop,
        suitability: suitabilityFromScore(top.modelValue),
        recommendation: recommendationLevelFromScore(top.modelValue),
        successRate: percentageFromModelValue(top.modelValue),
      }
    : crops[0]
      ? {
          ...crops[0],
          suitability: "none" as Suitability,
          recommendation: "low" as RecommendationLevel,
          successRate: 0,
        }
      : undefined

  if (!topCrop) {
    throw new Error("No crop data available")
  }

  const otherCrops = alternatives.map(toCropResponseLite)

  const topPlantingMonths = topCrop.plantingMonths.length > 0 ? topCrop.plantingMonths : [8]
  const month = nextPlantingMonth(topPlantingMonths)

  const sourceDescriptions: Record<RecommendationResponse["source"], string> = {
    data: "Estas recomendaciones se generan a partir de datos históricos de aptitud del suelo, clima y producción en esta zona. El modelo analiza qué cultivos han tenido mejor desempeño en condiciones similares.",
    climate: "Estas recomendaciones usan el pronóstico climático actual (temperatura, lluvia y humedad) para estimar qué cultivos se adaptan mejor en este momento.",
    mixed: "Se combinan recomendaciones basadas en datos históricos del municipio y predicciones climáticas actuales (modelo KNN). Los datos históricos indican cultivos con mejor desempeño en condiciones similares; las predicciones climáticas muestran la adaptación esperada en este momento. Ambas fuentes pueden aparecer juntas cuando el sistema dispone de información histórica y climática simultáneamente.",
    fallback: "Recomendación general cuando no hay datos históricos ni climáticos específicos suficientes para este municipio.",
  }

  const whyItMatters: Record<RecommendationResponse["source"], string> = {
    data: "Útil para decisiones de largo plazo basadas en el comportamiento real de la región.",
    climate: "Ideal para decidir qué sembrar en la próxima temporada según el clima esperado.",
    mixed: "Te permite comparar el comportamiento histórico del municipio con la situación climática actual. Si ambas fuentes coinciden, la recomendación es más robusta; si difieren, evalúa la opción con un agrónomo local.",
    fallback: "Sirve como punto de partida, pero se recomienda validar con un agrónomo local.",
  }

  return {
    topCrop,
    otherCrops,
    dataBasedCrops: dataBased.map(toCropResponseLite),
    climateBasedCrops: climateBased.map(toCropResponseLite),
    nextPlantingSeason: {
      month,
      monthName: MONTHS_LONG[month - 1] ?? MONTHS_LONG[7],
      crops: [topCrop.id, ...otherCrops.slice(0, 2).map((c) => c.id)],
    },
    source,
    sourceDescription: sourceDescriptions[source],
    whyItMatters: whyItMatters[source],
    modelVersion,
    method,
  }
}

export async function fetchRecommendations(
  municipalityId: string
): Promise<RecommendationResponse> {
  const [zoning, crops] = await Promise.all([
    fetchApi<ZoningBatchResponse>(`/zoning/recommendations/${municipalityId}`),
    fetchCrops(),
  ])

  return buildRecommendationResponse(zoning, crops)
}

export const recommendationsApi = {
  get: fetchRecommendations,
}
