import { fetchApi } from "./client"
import type {
  ZoningRequest,
  ZoningResponse,
  ZoningBatchRequest,
  ZoningBatchResponse,
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
  return fetchApi<ZoningBatchResponse>("/zoning/predict/batch", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export const zoningApi = {
  predict: predictZoning,
  predictBatch: predictZoningBatch,
}
