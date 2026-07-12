import { fetchApi } from "./client"
import type { ForecastResponse } from "./types"

export async function fetchDailyForecast(
  municipalityId: string,
  days = 4
): Promise<ForecastResponse["forecast"]> {
  const params = new URLSearchParams()
  if (days) params.append("days", days.toString())
  const response = await fetchApi<ForecastResponse>(`/forecast/daily/${municipalityId}?${params.toString()}`)
  return response.forecast
}

export const forecastApi = {
  daily: fetchDailyForecast,
}
