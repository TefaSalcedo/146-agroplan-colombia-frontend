import { useState, useEffect } from "react"
import { fetchRecommendations } from "@/lib/api-client/recommendations"
import type { RecommendationResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useRecommendations(municipalityId: string) {
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRecommendations = async (id: string) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRecommendations(id)
      setRecommendations(data)
    } catch (err) {
      setRecommendations(null)
      setError(err instanceof ApiError ? err.message : "Error loading recommendations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecommendations(municipalityId)
  }, [municipalityId])

  return { recommendations, loading, error, reload: loadRecommendations }
}
