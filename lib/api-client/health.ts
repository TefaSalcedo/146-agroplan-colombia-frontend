import { fetchApi } from "./client"
import type { HealthResponse, ReadinessResponse } from "./types"

export async function fetchHealth(): Promise<HealthResponse> {
  return fetchApi<HealthResponse>("/health")
}

export async function fetchReadiness(): Promise<ReadinessResponse> {
  return fetchApi<ReadinessResponse>("/readiness")
}

export const healthApi = {
  check: fetchHealth,
  readiness: fetchReadiness,
}
