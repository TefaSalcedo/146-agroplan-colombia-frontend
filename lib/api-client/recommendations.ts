import { fetchApi } from "./client"
import type { RecommendationRequest, RecommendationResponse } from "./types"

export async function fetchRecommendations(
  municipalityId: string
): Promise<RecommendationResponse> {
  return fetchApi<RecommendationResponse>("/recommendations", {
    method: "POST",
    body: JSON.stringify({ municipality_id: municipalityId }),
  })
}

export const recommendationsApi = {
  get: fetchRecommendations,
}
