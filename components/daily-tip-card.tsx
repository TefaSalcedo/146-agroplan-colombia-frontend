import { Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DailyTipCardProps {
  title?: string
  description: string
}

export function DailyTipCard({ title = "Consejo del día", description }: DailyTipCardProps) {
  return (
    <Card className="flex items-start gap-4 p-5">
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
