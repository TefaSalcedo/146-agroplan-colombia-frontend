import { useCallback, useState } from "react"
import { predictZoning, predictZoningBatch } from "@/lib/api-client/zoning"
import type {
  ZoningRequest,
  ZoningResponse,
  ZoningBatchRequest,
  ZoningBatchResponse,
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
    request: ZoningBatchRequest
  ): Promise<ZoningBatchResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await predictZoningBatch(request)
      return result
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error predicting batch zoning")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { predict, predictBatch, loading, error }
}
