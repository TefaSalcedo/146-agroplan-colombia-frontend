import { useState, useEffect } from "react"
import { fetchDailyForecast } from "@/lib/api-client/forecast"
import type { ForecastDayResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useExtendedForecast(municipalityId: string, days = 12, enabled = false) {
  const [forecast, setForecast] = useState<ForecastDayResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadForecast = async () => {
      if (!municipalityId || !enabled) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDailyForecast(municipalityId, days)
        setForecast(data)
      } catch (err) {
        setForecast([])
        setError(err instanceof ApiError ? err.message : "Error loading forecast")
      } finally {
        setLoading(false)
      }
    }
    loadForecast()
  }, [municipalityId, days, enabled])

  return { forecast, loading, error }
}
