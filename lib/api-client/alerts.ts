import { fetchApi } from "./client"
import type { AlertResponse } from "./types"

export async function fetchAlerts(municipalityId: string): Promise<AlertResponse[]> {
  return fetchApi<AlertResponse[]>(`/alerts/${municipalityId}`)
}

export const alertsApi = {
  list: fetchAlerts,
}
