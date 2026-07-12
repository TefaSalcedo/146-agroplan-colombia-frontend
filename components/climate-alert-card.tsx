import { Info, AlertTriangle, CloudLightning } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import type { AlertResponse } from "@/lib/api-client/types"

const config = {
  info: { icon: Info, tone: "text-primary bg-primary/10" },
  warning: { icon: AlertTriangle, tone: "text-amber-700 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300" },
  danger: { icon: CloudLightning, tone: "text-destructive bg-destructive/10" },
}

interface ClimateAlertCardProps {
  alert: AlertResponse
}

export function ClimateAlertCard({ alert }: ClimateAlertCardProps) {
  const { icon: Icon, tone } = config[alert.level] || config.info
  return (
    <Card className="flex flex-row items-start gap-3 p-4">
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tone)}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="font-medium leading-tight">{alert.title}</p>
        <p className="text-sm text-muted-foreground text-pretty">{alert.description}</p>
      </div>
    </Card>
  )
}
