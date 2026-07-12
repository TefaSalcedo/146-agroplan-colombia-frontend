import { useCallback, useState } from "react"
import { predictCalendar, predictCalendarBatch } from "@/lib/api-client/calendars"
import type {
  CalendarRequest,
  CalendarResponse,
  CalendarBatchRequest,
  CalendarBatchResponse,
} from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useCalendars() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = useCallback(async (request: CalendarRequest): Promise<CalendarResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await predictCalendar(request)
      return result
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error predicting calendar")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const predictBatch = useCallback(async (
    request: CalendarBatchRequest
  ): Promise<CalendarBatchResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await predictCalendarBatch(request)
      return result
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error predicting calendars")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { predict, predictBatch, loading, error }
}
