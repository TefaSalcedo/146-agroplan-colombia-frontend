import { cn } from "@/lib/utils"
import { MONTHS } from "@/lib/mock-data"

interface MonthStripProps {
  activeMonths: number[]
  tone?: "primary" | "accent"
}

export function MonthStrip({ activeMonths, tone = "primary" }: MonthStripProps) {
  const activeSet = new Set(activeMonths)
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
      {MONTHS.map((month, index) => {
        const active = activeSet.has(index + 1)
        return (
          <div
            key={month}
            className={cn(
              "flex h-10 flex-col items-center justify-center rounded-lg text-xs font-medium transition-colors",
              active
                ? tone === "primary"
                  ? "bg-primary text-primary-foreground"
                  : "bg-accent text-accent-foreground"
                : "bg-muted text-muted-foreground",
            )}
            aria-label={active ? `${month}, activo` : month}
          >
            {month}
          </div>
        )
      })}
    </div>
  )
}
