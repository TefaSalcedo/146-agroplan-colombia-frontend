import { fetchApi } from "./client"
import type {
  ZoningBatchResponse,
  ZoningMapResponse,
} from "./types"

export async function predictZoningBatch(
  municipalityId: string
): Promise<ZoningBatchResponse> {
  return fetchApi<ZoningBatchResponse>(`/zoning/recommendations/${municipalityId}`)
}

export async function fetchZoningMap(cropId: string): Promise<ZoningMapResponse> {
  return fetchApi<ZoningMapResponse>(`/zoning/map/${cropId}`)
}

export const zoningApi = {
  predictBatch: predictZoningBatch,
  getMap: fetchZoningMap,
}
