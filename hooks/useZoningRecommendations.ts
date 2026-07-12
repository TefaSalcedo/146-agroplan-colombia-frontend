import { useState, useEffect } from "react"
import { predictZoningBatch } from "@/lib/api-client/zoning"
import type { ZoningBatchResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useZoningRecommendations(municipalityId: string) {
  const [zoningData, setZoningData] = useState<ZoningBatchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadZoningRecommendations = async (id: string) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await predictZoningBatch(id)
      setZoningData(data)
    } catch (err) {
      setZoningData(null)
      setError(err instanceof ApiError ? err.message : "Error loading zoning recommendations")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadZoningRecommendations(municipalityId)
  }, [municipalityId])

  return { 
    zoningData, 
    loading, 
    error, 
    reload: loadZoningRecommendations,
    // Helper to check if we have data-based results
    hasDataResults: zoningData?.results && zoningData.results.length > 0,
    // Helper to check if we have climate-based recommendations
    hasClimateRecommendations: zoningData?.climateBasedRecommendations && zoningData.climateBasedRecommendations.length > 0,
  }
}