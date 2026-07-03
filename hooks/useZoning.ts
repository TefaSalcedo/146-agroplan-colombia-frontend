import { useState } from "react"
import { predictZoning } from "@/lib/api-client/zoning"
import type { ZoningRequest, ZoningResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useZoning() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = async (request: ZoningRequest): Promise<ZoningResponse | null> => {
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
  }

  return { predict, loading, error }
}
