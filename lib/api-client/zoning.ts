import { fetchApi } from "./client"
import type {
  ZoningRequest,
  ZoningResponse,
  ZoningBatchRequest,
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
  request: ZoningBatchRequest
): Promise<ZoningBatchResponse> {
  return fetchApi<ZoningBatchResponse>("/zoning/recommendations", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export async function fetchZoningMap(cropId: string): Promise<ZoningMapResponse> {
  return fetchApi<ZoningMapResponse>(`/zoning/map/${cropId}`)
}

export const zoningApi = {
  predict: predictZoning,
  predictBatch: predictZoningBatch,
  getMap: fetchZoningMap,
}
