import { fetchApi } from "./client"
import type { AlertsResponse, AlertResponse } from "./types"

export async function fetchAlerts(municipalityId: string): Promise<AlertResponse[]> {
  const response = await fetchApi<AlertsResponse>(`/alerts/${municipalityId}`)
  return response.alerts
}

export const alertsApi = {
  list: fetchAlerts,
}
