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
      setWeather(null)
      const message = err instanceof ApiError
        ? err.status === 404 || err.status === 500
          ? "No se pudo obtener el clima. El servicio puede no estar disponible temporalmente."
          : err.message
        : "Error de conexión al obtener el clima"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeather(municipalityId)
  }, [municipalityId])

  return { weather, loading, error, reload: loadWeather }
}
