import { useState, useEffect } from "react"
import { fetchWeather } from "@/lib/api-client/weather"
import type { Weather } from "@/types"
import { ApiError } from "@/lib/api-client/client"

export function useWeather(municipalityId: string) {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadWeather = async (id: string) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWeather(id)
      setWeather(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error loading weather")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeather(municipalityId)
  }, [municipalityId])

  return { weather, loading, error, reload: loadWeather }
}
