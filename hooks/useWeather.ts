import { useState, useEffect } from "react"
import { fetchWeather } from "@/lib/api-client/weather"
import { fetchDailyForecast } from "@/lib/api-client/forecast"
import type { Weather } from "@/types"
import { ApiError } from "@/lib/api-client/client"

function weatherFromForecast(forecast: Awaited<ReturnType<typeof fetchDailyForecast>>): Weather | null {
  const firstDay = forecast[0]
  if (!firstDay) return null

  const precipitation = firstDay.precipitation ?? 0
  const humidity = firstDay.humidity ?? 0
  let condition = "Despejado"
  let icon: Weather["icon"] = "sun"

  if (precipitation > 0.5) {
    condition = "Lluvia"
    icon = "rain"
  } else if (humidity > 70) {
    condition = "Nublado"
    icon = "cloud"
  }

  return {
    temperature: firstDay.tempMean ?? firstDay.tempMax ?? 0,
    condition,
    humidity,
    precipitation,
    icon,
  }
}

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
      try {
        const forecast = await fetchDailyForecast(id, 1)
        const fallback = weatherFromForecast(forecast)
        if (fallback) {
          setWeather(fallback)
          setError(null)
        } else {
          setWeather(null)
          setError("No se pudo obtener el clima. El servicio puede no estar disponible temporalmente.")
        }
      } catch {
        setWeather(null)
        const message = err instanceof ApiError
          ? err.status === 404 || err.status === 500 || err.status === 502
            ? "No se pudo obtener el clima. El servicio puede no estar disponible temporalmente."
            : err.message
          : "Error de conexión al obtener el clima"
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeather(municipalityId)
  }, [municipalityId])

  return { weather, loading, error, reload: loadWeather }
}
