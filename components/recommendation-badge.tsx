import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getRecommendationLabel, getSuitabilityLabel } from "@/lib/mock-data"

const toneMap: Record<string, string> = {
  high: "bg-primary/15 text-primary border-primary/20",
  medium: "bg-accent text-accent-foreground border-accent",
  low: "bg-muted text-muted-foreground border-border",
  none: "bg-muted text-muted-foreground border-border",
}

export function RecommendationBadge({
  level,
  className,
}: {
  level: "high" | "medium" | "low"
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn("font-medium", toneMap[level], className)}>
      {getRecommendationLabel(level)}
    </Badge>
  )
}

export function SuitabilityBadge({
  level,
  className,
}: {
  level: "high" | "medium" | "low" | "none"
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn("font-medium", toneMap[level], className)}>
      {getSuitabilityLabel(level)}
    </Badge>
  )
}
