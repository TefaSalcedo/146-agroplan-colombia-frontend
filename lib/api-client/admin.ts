import { fetchApi } from "./client"
import type {
  ClimateSyncStatusResponse,
  ModelsStatusResponse,
  CacheStatsResponse,
  CacheInvalidateRequest,
  CacheInvalidateResponse,
  PredictionRunResponse,
} from "./types"

export async function fetchClimateSyncStatus(): Promise<ClimateSyncStatusResponse> {
  return fetchApi<ClimateSyncStatusResponse>("/admin/climate-sync/status")
}

export async function fetchModelsStatus(): Promise<ModelsStatusResponse> {
  return fetchApi<ModelsStatusResponse>("/admin/models/status")
}

export async function fetchCacheStats(): Promise<CacheStatsResponse> {
  return fetchApi<CacheStatsResponse>("/admin/cache/stats")
}

export async function invalidateCache(
  request: CacheInvalidateRequest = {}
): Promise<CacheInvalidateResponse> {
  return fetchApi<CacheInvalidateResponse>("/admin/cache/invalidate", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export async function fetchRecentPredictionRuns(
  limit = 20
): Promise<PredictionRunResponse[]> {
  return fetchApi<PredictionRunResponse[]>(`/admin/audit/recent?limit=${limit}`)
}

export const adminApi = {
  climateSyncStatus: fetchClimateSyncStatus,
  modelsStatus: fetchModelsStatus,
  cacheStats: fetchCacheStats,
  invalidateCache,
  recentPredictionRuns: fetchRecentPredictionRuns,
}
