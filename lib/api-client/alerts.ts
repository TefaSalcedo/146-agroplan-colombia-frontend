import { fetchApi } from "./client"
import type { AlertsResponse, AlertResponse } from "./types"

export async function fetchAlerts(municipalityId: string): Promise<AlertResponse[]> {
  const response = await fetchApi<AlertResponse[] | AlertsResponse>(`/alerts/${municipalityId}`)
  if (Array.isArray(response)) {
    return response
  }
  return response?.alerts || []
}

export const alertsApi = {
  list: fetchAlerts,
}
