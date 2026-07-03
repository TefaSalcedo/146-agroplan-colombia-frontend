import { useState } from "react"
import { predictCalendar } from "@/lib/api-client/calendars"
import type { CalendarRequest, CalendarResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useCalendars() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = async (request: CalendarRequest): Promise<CalendarResponse | null> => {
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
  }

  return { predict, loading, error }
}
