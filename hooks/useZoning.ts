import { useCallback, useState } from "react"
import { predictZoning, predictZoningBatch, fetchZoningMap } from "@/lib/api-client/zoning"
import type {
  ZoningRequest,
  ZoningResponse,
  ZoningBatchResponse,
  ZoningMapResponse,
} from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useZoning() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = useCallback(async (request: ZoningRequest): Promise<ZoningResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await predictZoning(request)
      return result
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error predicting zoning")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const predictBatch = useCallback(async (
    municipalityId: string
  ): Promise<ZoningBatchResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await predictZoningBatch(municipalityId)
      return result
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error predicting batch zoning")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getMap = useCallback(async (cropId: string): Promise<ZoningMapResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchZoningMap(cropId)
      return result
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error loading zoning map")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { predict, predictBatch, getMap, loading, error }
}
