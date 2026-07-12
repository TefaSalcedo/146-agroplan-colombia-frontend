"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CropImage } from "@/components/crop-image"
import { cn } from "@/lib/utils"
import { MONTHS } from "@/lib/constants"
import type { CalendarBatchResponse, CalendarCropResult } from "@/lib/api-client/types"

export type CalendarMode = "compact" | "full"

interface AgriculturalCalendarProps {
  batchResponse: CalendarBatchResponse | null
  mode?: CalendarMode
  loading?: boolean
  className?: string
}

type MonthActivity =
  | "sowing-ideal"
  | "sowing-possible"
  | "harvest"
  | "harvest-possible"
  | null

function getActivitiesForCrop(result: CalendarCropResult): MonthActivity[] {
  const activities: MonthActivity[] = Array(12).fill(null)

  // Mark harvest months from topHarvestWindows.
  // A month is "harvest" if it appears as a harvestMonth in any window.
  for (const window of result.topHarvestMonths) {
    const harvestMonth = window.harvestMonth
    if (harvestMonth >= 1 && harvestMonth <= 12) {
      // Higher score windows are treated as the main harvest window.
      activities[harvestMonth - 1] = window.score >= 0.7 ? "harvest" : "harvest-possible"
    }

    // Mark planting months.
    for (const month of window.plantingMonths) {
      if (month >= 1 && month <= 12) {
        const current = activities[month - 1]
        // Harvest takes precedence if already marked.
        if (current === "harvest" || current === "harvest-possible") continue
        activities[month - 1] = window.score >= 0.7 ? "sowing-ideal" : "sowing-possible"
      }
    }
  }

  return activities
}

function ActivityPill({ activity, label }: { activity: MonthActivity; label?: string }) {
  const base = "inline-flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-medium"
  if (!activity) {
    return <span className={cn(base, "invisible bg-transparent")}>—</span>
  }

  const configs: Record<Exclude<MonthActivity, null>, { className: string; text: string }> = {
    "sowing-ideal": {
      className: "bg-emerald-600 text-white",
      text: label ?? "Siembra ideal",
    },
    "sowing-possible": {
      className: "bg-emerald-200 text-emerald-900",
      text: label ?? "Siembra posible",
    },
    harvest: {
      className: "bg-amber-500 text-white",
      text: label ?? "Cosecha",
    },
    "harvest-possible": {
      className: "bg-amber-200 text-amber-900",
      text: label ?? "Cosecha posible",
    },
  }

  const config = configs[activity]
  return <span className={cn(base, config.className)}>{config.text}</span>
}

export function AgriculturalCalendar({
  batchResponse,
  mode = "full",
  loading = false,
  className,
}: AgriculturalCalendarProps) {
  const rows = useMemo(() => {
    if (!batchResponse) return []
    return batchResponse.results.map((result) => ({
      result,
      activities: getActivitiesForCrop(result),
    }))
  }, [batchResponse])

  const isCompact = mode === "compact"

  if (loading) {
    return (
      <Card className={cn("overflow-hidden p-4 md:p-6", className)}>
        <div className="space-y-4">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  if (!batchResponse || rows.length === 0) {
    return (
      <Card className={cn("flex flex-col items-center justify-center gap-2 p-8 text-center", className)}>
        <p className="font-medium">Calendario no disponible</p>
        <p className="text-sm text-muted-foreground">
          No pudimos cargar el calendario agrícola para este municipio.
        </p>
      </Card>
    )
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 z-10 w-40 bg-card px-4 py-3 text-left text-sm font-medium text-muted-foreground md:w-48">
                Cultivo
              </th>
              {MONTHS.map((month) => (
                <th
                  key={month}
                  className="px-1 py-3 text-center text-xs font-medium text-muted-foreground"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ result, activities }) => (
              <tr key={result.cropId} className="border-b last:border-b-0">
                <td className="sticky left-0 z-10 bg-card px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-9 overflow-hidden rounded-lg bg-muted md:size-10">
                      <CropImage
                        src={`/crops/${result.cropId}.png`}
                        alt={result.cropName}
                        fill
                        sizes="40px"
                      />
                    </div>
                    <span className="text-sm font-medium">{result.cropName}</span>
                  </div>
                </td>
                {activities.map((activity, index) => (
                  <td key={index} className="px-1 py-3 text-center">
                    {activity ? (
                      <div
                        className={cn(
                          "mx-auto h-7 w-7 rounded-full md:h-8 md:w-8",
                          activity === "sowing-ideal" && "bg-emerald-600",
                          activity === "sowing-possible" && "bg-emerald-200",
                          activity === "harvest" && "bg-amber-500",
                          activity === "harvest-possible" && "bg-amber-200"
                        )}
                        title={
                          activity === "sowing-ideal"
                            ? "Siembra ideal"
                            : activity === "sowing-possible"
                            ? "Siembra posible"
                            : activity === "harvest"
                            ? "Cosecha"
                            : "Cosecha posible"
                        }
                      />
                    ) : (
                      <div className="mx-auto h-7 w-7 rounded-full border border-dashed border-muted-foreground/20 md:h-8 md:w-8" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isCompact && (
        <div className="flex flex-wrap items-center gap-4 border-t bg-muted/30 px-4 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-emerald-600" />
            <span>Siembra ideal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-emerald-200" />
            <span>Siembra posible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-amber-500" />
            <span>Cosecha</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-amber-200" />
            <span>Cosecha posible</span>
          </div>
        </div>
      )}
    </Card>
  )
}

export function AgriculturalCalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-emerald-600" />
        <span>Siembra ideal</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-emerald-200" />
        <span>Siembra posible</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-amber-500" />
        <span>Cosecha</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-3 rounded-full bg-amber-200" />
        <span>Cosecha posible</span>
      </div>
    </div>
  )
}
