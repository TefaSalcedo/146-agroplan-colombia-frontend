import { Sprout, Leaf, Flower2, Wheat, CircleDot } from "lucide-react"
import type { GrowthStage } from "@/types"

const iconMap = {
  seed: CircleDot,
  sprout: Sprout,
  leaf: Leaf,
  flower: Flower2,
  harvest: Wheat,
}

export function Timeline({ stages }: { stages: GrowthStage[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-5 sm:gap-2">
      {stages.map((stage, index) => {
        const Icon = iconMap[stage.icon] ?? CircleDot
        return (
          <li key={stage.label} className="relative flex gap-4 sm:flex-col sm:gap-3 sm:text-center">
            {/* connector */}
            {index < stages.length - 1 && (
              <span
                aria-hidden
                className="absolute left-6 top-12 h-[calc(100%-1rem)] w-0.5 bg-border sm:left-[calc(50%+1.5rem)] sm:top-6 sm:h-0.5 sm:w-[calc(100%-3rem)]"
              />
            )}
            <div className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:mx-auto">
              <Icon className="size-6" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold leading-tight">{stage.label}</p>
              <p className="text-sm text-muted-foreground text-pretty">{stage.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
