import { fetchApi } from "./client"
import type { ZoningRequest, ZoningResponse } from "./types"

export async function predictZoning(
  request: ZoningRequest
): Promise<ZoningResponse> {
  return fetchApi<ZoningResponse>("/zoning/predict", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export const zoningApi = {
  predict: predictZoning,
}
