import { useState, useEffect } from "react"
import { fetchDailyForecast } from "@/lib/api-client/forecast"
import type { ForecastDayResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useForecast(municipalityId: string, days: number = 7) {
  const [forecast, setForecast] = useState<ForecastDayResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadForecast = async () => {
      if (!municipalityId) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDailyForecast(municipalityId, days)
        setForecast(data)
      } catch (err) {
        const message = err instanceof ApiError
          ? err.status === 404 || err.status === 500
            ? "No se pudo obtener el pronóstico. El servicio puede no estar disponible temporalmente."
            : err.message
          : "Error de conexión al obtener el pronóstico"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadForecast()
  }, [municipalityId, days])

  return { forecast, loading, error }
}
