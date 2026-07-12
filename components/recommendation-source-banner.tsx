import { Database, Cloud, AlertCircle, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RecommendationSourceBannerProps {
  source: "data" | "climate" | "mixed" | "fallback" | undefined
  sourceDescription: string
  whyItMatters: string
  modelVersion: string
  method: string
}

const sourceConfig = {
  data: {
    badge: "Basado en datos históricos",
    badgeClass: "bg-primary/15 text-primary border-primary/20",
    icon: Database,
    title: "Recomendación basada en datos históricos",
    border: "border-l-primary",
    bg: "bg-primary/5",
  },
  climate: {
    badge: "Predicción climática",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-200",
    icon: Cloud,
    title: "Recomendación basada en el clima actual",
    border: "border-l-sky-500",
    bg: "bg-sky-50/50 dark:bg-sky-950/30",
  },
  mixed: {
    badge: "Datos + clima",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: Layers,
    title: "Recomendación combinada: histórica y climática",
    border: "border-l-emerald-500",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/30",
  },
  fallback: {
    badge: "Recomendación general",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    icon: AlertCircle,
    title: "Recomendación general",
    border: "border-l-amber-500",
    bg: "bg-amber-50/50 dark:bg-amber-950/30",
  },
}

export function RecommendationSourceBanner({
  source,
  sourceDescription,
  whyItMatters,
  modelVersion,
  method,
}: RecommendationSourceBannerProps) {
  const config = sourceConfig[source ?? "fallback"]
  const Icon = config.icon

  return (
    <div className={cn("rounded-xl border border-l-4 p-4", config.border, config.bg)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("w-fit gap-1.5 text-xs font-medium", config.badgeClass)}>
            <Icon className="size-3.5" />
            {config.badge}
          </Badge>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold">{config.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{sourceDescription}</p>
          <p className="text-sm leading-relaxed text-foreground">
            <span className="font-medium">¿Por qué importa? </span>
            {whyItMatters}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Modelo: <span className="font-medium text-foreground">{modelVersion}</span>
          {method && method !== "unknown" && (
            <>
              {" · "}
              Método: <span className="font-medium text-foreground">{method}</span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
