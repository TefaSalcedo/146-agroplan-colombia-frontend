import { fetchApi } from "./client"
import type { CalendarRequest, CalendarResponse } from "./types"

export async function predictCalendar(
  request: CalendarRequest
): Promise<CalendarResponse> {
  return fetchApi<CalendarResponse>("/calendars/predict", {
    method: "POST",
    body: JSON.stringify(request),
  })
}

export const calendarsApi = {
  predict: predictCalendar,
}
