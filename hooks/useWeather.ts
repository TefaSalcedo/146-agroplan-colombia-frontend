import { useState, useEffect } from "react"
import { fetchWeather } from "@/lib/api-client/weather"
import type { WeatherResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useWeather(municipalityId: string) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadWeather = async () => {
      if (!municipalityId) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchWeather(municipalityId)
        setWeather(data)
      } catch (err) {
        setWeather(null)
        setError(err instanceof ApiError ? err.message : "Error loading weather")
      } finally {
        setLoading(false)
      }
    }
    loadWeather()
  }, [municipalityId])

  return { weather, loading, error }
}
