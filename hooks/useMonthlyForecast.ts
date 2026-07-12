import { useState, useEffect } from "react"
import { fetchMonthlyForecast } from "@/lib/api-client/forecast"
import type { MonthlyForecastResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useMonthlyForecast(municipalityId: string, months = 4) {
  const [forecast, setForecast] = useState<MonthlyForecastResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadForecast = async () => {
      if (!municipalityId) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMonthlyForecast(municipalityId, months)
        setForecast(data)
      } catch (err) {
        setForecast(null)
        setError(err instanceof ApiError ? err.message : "Error loading monthly forecast")
      } finally {
        setLoading(false)
      }
    }
    loadForecast()
  }, [municipalityId, months])

  return { forecast, loading, error }
}
