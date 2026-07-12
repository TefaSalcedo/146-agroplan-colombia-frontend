import { useState, useEffect, useCallback } from "react"
import { predictCalendarBatch } from "@/lib/api-client/calendars"
import type { CalendarBatchRequest, CalendarBatchResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useCropCalendar(cropId: string, municipalityId: string) {
  const [calendarData, setCalendarData] = useState<CalendarBatchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCalendar = useCallback(async () => {
    if (!cropId || !municipalityId) return
    setLoading(true)
    setError(null)
    try {
      const request: CalendarBatchRequest = {
        municipality_id: municipalityId,
        crop_ids: [cropId],
        horizon_months: 12,
      }
      const data = await predictCalendarBatch(request)
      setCalendarData(data)
    } catch (err) {
      setCalendarData(null)
      setError(err instanceof ApiError ? err.message : "Error loading crop calendar")
    } finally {
      setLoading(false)
    }
  }, [cropId, municipalityId])

  useEffect(() => {
    loadCalendar()
  }, [loadCalendar])

  const cropResult = calendarData?.results?.[0]

  return {
    calendarData,
    cropResult,
    loading,
    error,
    reload: loadCalendar,
  }
}