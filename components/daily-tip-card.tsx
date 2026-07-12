import { Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DailyTipCardProps {
  title?: string
  description: string
  className?: string
}

export function DailyTipCard({ title = "Consejo del día", description, className }: DailyTipCardProps) {
  return (
    <Card className={cn("flex items-start gap-4 p-5", className)}>
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Lightbulb className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
      </div>
    </Card>
  )
}
