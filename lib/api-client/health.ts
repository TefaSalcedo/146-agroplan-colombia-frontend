import { fetchApi } from "./client"
import type { HealthResponse } from "./types"

export async function fetchHealth(): Promise<HealthResponse> {
  return fetchApi<HealthResponse>("/health")
}

export const healthApi = {
  check: fetchHealth,
}
