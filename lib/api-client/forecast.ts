import { fetchApi } from "./client"
import type { ForecastDayResponse } from "./types"

export async function fetchDailyForecast(
  municipalityId: string,
  days: number = 7
): Promise<ForecastDayResponse[]> {
  return fetchApi<ForecastDayResponse[]>(`/forecast/daily/${municipalityId}?days=${days}`)
}

export const forecastApi = {
  daily: fetchDailyForecast,
}
