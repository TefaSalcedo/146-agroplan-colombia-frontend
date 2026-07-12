import { fetchApi } from "./client"
import type {
  CalendarRequest,
  CalendarResponse,
  CalendarBatchRequest,
  CalendarBatchResponse,
  CalendarDay,
} from "./types"

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

function getMonthRating(
  month: number,
  year: number,
  result: CalendarBatchResponse["results"][number]
): "ideal" | "acceptable" | "notRecommended" {
  const isPlantingMonth = result.topHarvestMonths.some((window) => {
    if (!window.plantingMonths.includes(month)) return false
    if (window.plantingYear == null) return true
    return window.plantingYear === year
  })

  if (isPlantingMonth) return "ideal"

  const forecast = result.monthlyForecasts.find((f) => f.month === month && f.year === year)
  if (forecast && forecast.climateSource === "open_meteo_forecast") return "acceptable"

  return "notRecommended"
}

export async function predictCalendar(
  request: CalendarRequest
): Promise<CalendarResponse> {
  const batchRequest: CalendarBatchRequest = {
    municipality_id: request.municipality_id,
    crop_ids: [request.crop_id],
    horizon_months: 12,
  }

  const batch = await fetchApi<CalendarBatchResponse>("/calendars/predict-batch", {
    method: "POST",
    body: JSON.stringify(batchRequest),
  })

  const result = batch.results.find((r) => r.cropId === request.crop_id)
  if (!result) {
    throw new Error(`No calendar result for crop ${request.crop_id}`)
  }

  const rating = getMonthRating(request.month, request.year, result)
  const totalDays = daysInMonth(request.year, request.month)

  const days: CalendarDay[] = Array.from({ length: totalDays }, (_, i) => ({
    day: i + 1,
    rating,
  }))

  return {
    cropId: request.crop_id,
    municipalityId: request.municipality_id,
    month: request.month,
    year: request.year,
    days,
    idealCount: days.filter((d) => d.rating === "ideal").length,
    modelVersion: batch.modelVersion,
  }
}

export async function predictCalendarBatch(
  request: CalendarBatchRequest
): Promise<CalendarBatchResponse> {
  return fetchApi<CalendarBatchResponse>("/calendars/predict-batch", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export const calendarsApi = {
  predict: predictCalendar,
  predictBatch: predictCalendarBatch,
}
