import { useState, useEffect } from "react"
import { fetchAlerts } from "@/lib/api-client/alerts"
import type { AlertResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useAlerts(municipalityId: string) {
  const [alerts, setAlerts] = useState<AlertResponse[]>([])
  const [loading, setLoading] = useState(Boolean(municipalityId))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAlerts = async () => {
      if (!municipalityId) {
        setAlerts([])
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const data = await fetchAlerts(municipalityId)
        setAlerts(data)
      } catch (err) {
        setAlerts([])
        setError(err instanceof ApiError ? err.message : "Error loading alerts")
      } finally {
        setLoading(false)
      }
    }
    loadAlerts()
  }, [municipalityId])

  return { alerts, loading, error }
}
