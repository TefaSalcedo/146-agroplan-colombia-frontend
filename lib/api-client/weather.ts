import { fetchApi } from "./client"
import type { WeatherResponse } from "./types"
import type { Weather } from "@/types"

export async function fetchWeather(
  municipalityId: string
): Promise<Weather> {
  const response = await fetchApi<WeatherResponse>(
    `/weather/${municipalityId}`
  )
  
  return {
    temperature: response.temperature,
    condition: response.condition,
    humidity: response.humidity,
    precipitation: response.precipitation,
    icon: response.icon,
  }
}

export const weatherApi = {
  get: fetchWeather,
}
