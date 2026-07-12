// Calendar helpers used to determine how close a crop is to its next
// planting or harvest window. All functions are pure and use an optional
// reference date so they remain easy to test.

import { MONTHS_LONG } from "@/lib/constants"

export interface CalendarProximity {
  /** Human readable label, e.g. "Siembra hoy" or "Cosecha en 15 días". */
  label: string
  /** Days until the start of the target month, null when it is the current month. */
  daysUntil: number | null
  /** Whether the reference date is inside the target month window. */
  isNow: boolean
  /** 1-based month number of the next target month. */
  targetMonth: number
}

function getNextOccurrenceMonth(
  activeMonths: number[],
  referenceDate: Date,
): { targetMonth: number; monthsAhead: number } {
  const currentMonth = referenceDate.getMonth() + 1
  const activeSet = new Set(activeMonths)

  if (activeSet.has(currentMonth)) {
    return { targetMonth: currentMonth, monthsAhead: 0 }
  }

  for (let offset = 1; offset <= 12; offset += 1) {
    const candidate = ((currentMonth + offset - 1) % 12) + 1
    if (activeSet.has(candidate)) {
      return { targetMonth: candidate, monthsAhead: offset }
    }
  }

  // Fallback to current month when no active months are defined.
  return { targetMonth: currentMonth, monthsAhead: 0 }
}

function getDaysUntilMonth(referenceDate: Date, monthsAhead: number): number {
  const target = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + monthsAhead, 1)
  const diffMs = target.getTime() - referenceDate.getTime()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}

function formatProximity(
  actionLabel: string,
  daysUntil: number | null,
  monthsAhead: number,
): string {
  if (monthsAhead === 0 || daysUntil === null) {
    return `${actionLabel} hoy`
  }

  if (daysUntil <= 30) {
    return `${actionLabel} en ${daysUntil} día${daysUntil === 1 ? "" : "s"}`
  }

  if (monthsAhead === 1) {
    return `${actionLabel} en 1 mes`
  }

  return `${actionLabel} en ${monthsAhead} meses`
}

export function getPlantingStatus(
  plantingMonths: number[],
  referenceDate: Date = new Date(),
): CalendarProximity {
  const { targetMonth, monthsAhead } = getNextOccurrenceMonth(plantingMonths, referenceDate)
  const daysUntil = monthsAhead === 0 ? null : getDaysUntilMonth(referenceDate, monthsAhead)

  return {
    label: formatProximity("Siembra", daysUntil, monthsAhead),
    daysUntil,
    isNow: monthsAhead === 0,
    targetMonth,
  }
}

export function getHarvestStatus(
  harvestMonths: number[],
  daysToHarvest: number | undefined,
  referenceDate: Date = new Date(),
): CalendarProximity {
  const { targetMonth, monthsAhead } = getNextOccurrenceMonth(harvestMonths, referenceDate)

  let daysUntil: number | null = null
  if (monthsAhead === 0) {
    daysUntil = null
  } else if (daysToHarvest && daysToHarvest > 0) {
    // If the crop has a known cycle, estimate days left from the cycle length.
    // Otherwise fall back to days until the start of the harvest month.
    const daysUntilMonthStart = getDaysUntilMonth(referenceDate, monthsAhead)
    daysUntil = Math.min(daysUntilMonthStart, daysToHarvest)
  } else {
    daysUntil = getDaysUntilMonth(referenceDate, monthsAhead)
  }

  return {
    label: formatProximity("Cosecha", daysUntil, monthsAhead),
    daysUntil,
    isNow: monthsAhead === 0,
    targetMonth,
  }
}

export function estimateMaturity(
  daysUntilHarvest: number | null,
  daysToHarvest: number | undefined,
): number {
  if (!daysToHarvest || daysToHarvest <= 0 || daysUntilHarvest === null) {
    return 100
  }

  const remaining = Math.min(daysUntilHarvest, daysToHarvest)
  const maturity = Math.round(((daysToHarvest - remaining) / daysToHarvest) * 100)
  return Math.min(100, Math.max(0, maturity))
}

export function getMonthName(month: number): string {
  return MONTHS_LONG[month - 1] ?? ""
}

/**
 * Returns an approximate planting window label for the next sowing month.
 * Example: "15 - 22 Julio".
 * This is a presentation approximation because the API does not yet provide
 * a day-level planting window for recommendations.
 */
export function getPlantingWindowLabel(
  plantingMonths: number[],
  referenceDate: Date = new Date(),
): string {
  const { targetMonth } = getNextOccurrenceMonth(plantingMonths, referenceDate)
  const monthName = getMonthName(targetMonth)
  return `15 - 22 ${monthName}`
}
