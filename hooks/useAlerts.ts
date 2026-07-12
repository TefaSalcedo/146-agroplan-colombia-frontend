import { useState, useEffect } from "react"
import { fetchAlerts } from "@/lib/api-client/alerts"
import type { AlertResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useAlerts(municipalityId: string) {
  const [alerts, setAlerts] = useState<AlertResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAlerts = async () => {
      if (!municipalityId) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAlerts(municipalityId)
        setAlerts(data)
      } catch (err) {
        const message = err instanceof ApiError
          ? err.status === 404 || err.status === 500
            ? "No se pudo obtener las alertas. El servicio puede no estar disponible temporalmente."
            : err.message
          : "Error de conexión al obtener las alertas"
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()
  }, [municipalityId])

  return { alerts, loading, error }
}
