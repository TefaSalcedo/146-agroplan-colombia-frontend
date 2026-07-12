import { fetchApi } from "./client"
import type { ForecastDayResponse, ForecastResponse, MonthlyForecastResponse } from "./types"

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

export async function fetchMonthlyForecast(
  municipalityId: string,
  months = 4
): Promise<MonthlyForecastResponse> {
  const params = new URLSearchParams()
  if (months) params.append("months", months.toString())
  return fetchApi<MonthlyForecastResponse>(
    `/forecast/monthly/${municipalityId}?${params.toString()}`
  )
}

export const forecastApi = {
  daily: fetchDailyForecast,
  monthly: fetchMonthlyForecast,
}
