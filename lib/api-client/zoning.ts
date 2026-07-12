import { fetchApi } from "./client"
import type {
  ZoningRequest,
  ZoningResponse,
  ZoningBatchResponse,
  ZoningMapResponse,
} from "./types"

export async function predictZoning(
  request: ZoningRequest
): Promise<ZoningResponse> {
  return fetchApi<ZoningResponse>("/zoning/predict", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export async function predictZoningBatch(
  municipalityId: string
): Promise<ZoningBatchResponse> {
  return fetchApi<ZoningBatchResponse>(`/zoning/recommendations/${municipalityId}`)
}

export async function fetchZoningMap(cropId: string): Promise<ZoningMapResponse> {
  return fetchApi<ZoningMapResponse>(`/zoning/map/${cropId}`)
}

export const zoningApi = {
  predict: predictZoning,
  predictBatch: predictZoningBatch,
  getMap: fetchZoningMap,
}
