import { fetchApi } from "./client"
import type { AiInsightsResponse } from "./types"

export async function fetchAiInsights(
  municipalityId: string,
  options: RequestInit = {}
): Promise<AiInsightsResponse> {
  return fetchApi<AiInsightsResponse>(`/zoning/recommendations/${municipalityId}/ai-insights`, options)
}

export const aiInsightsApi = {
  get: fetchAiInsights,
}
