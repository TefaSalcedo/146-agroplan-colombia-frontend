import { fetchApi } from "./client"
import type { WeatherResponse } from "./types"

export async function fetchWeather(municipalityId: string): Promise<WeatherResponse> {
  return fetchApi<WeatherResponse>(`/weather/${municipalityId}`)
}

export const weatherApi = {
  get: fetchWeather,
}
