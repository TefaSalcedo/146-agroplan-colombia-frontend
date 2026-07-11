import { fetchApi } from "./client"
import type { WeatherResponse } from "./types"
import type { Weather } from "@/types"

const validIcons = ["sun", "cloud", "rain", "partly"] as const

type WeatherIcon = (typeof validIcons)[number]

function parseIcon(icon: string): WeatherIcon {
  const normalized = icon.toLowerCase().trim()
  if (validIcons.includes(normalized as WeatherIcon)) {
    return normalized as WeatherIcon
  }
  return "partly"
}

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
    icon: parseIcon(response.icon),
  }
}

export const weatherApi = {
  get: fetchWeather,
}
