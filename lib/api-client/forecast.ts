import { fetchApi } from "./client"
import type { ForecastDayResponse, ForecastResponse } from "./types"

export async function fetchDailyForecast(
  municipalityId: string,
  days = 4
): Promise<ForecastDayResponse[]> {
  const params = new URLSearchParams()
  if (days) params.append("days", days.toString())
  const response = await fetchApi<ForecastDayResponse[] | ForecastResponse>(
    `/forecast/daily/${municipalityId}?${params.toString()}`
  )
  return Array.isArray(response) ? response : response.forecast
}

export const forecastApi = {
  daily: fetchDailyForecast,
}
