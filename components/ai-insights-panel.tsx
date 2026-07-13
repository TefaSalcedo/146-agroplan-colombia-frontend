"use client"

import Image from "next/image"
import {
  AlertCircle,
  Sparkles,
  Sprout,
  Droplets,
  Shovel,
  Leaf,
  RefreshCw,
  LayoutGrid,
  TreeDeciduous,
  Waves,
  Recycle,
  Layers,
  Bug,
  Mountain,
  Sun,
  Carrot,
  Wheat,
  CircleDot,
  Flower2,
  Wind,
  ArrowDownToLine,
  ShieldCheck,
  BadgeCheck,
  XCircle,
  HelpCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type {
  AiInsightsResponse,
  AiInsightsAlternativeCrop,
  AiInsightsFarmingSystem,
  AiInsightsSoilAndFertilizer,
} from "@/lib/api-client/types"

interface AiInsightsPanelProps {
  insights?: AiInsightsResponse | null
  loading?: boolean
  error?: string | null
  retryAttempt?: number
  municipalityName?: string
  onReload?: () => void
}

const confidenceConfig = {
  high: {
    label: "Alta",
    percent: 90,
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
  },
  medium: {
    label: "Media",
    percent: 60,
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    bar: "bg-amber-500",
  },
  low: {
    label: "Baja",
    percent: 30,
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    bar: "bg-rose-500",
  },
}

const suitableConfig = {
  yes: {
    label: "Apto",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  maybe: {
    label: "Parcial",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  no: {
    label: "No apto",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
}

function getConfidenceLabel(confidence: string): string {
  return confidenceConfig[confidence as keyof typeof confidenceConfig]?.label ?? confidence
}

function getConfidencePercent(confidence: string): number {
  return confidenceConfig[confidence as keyof typeof confidenceConfig]?.percent ?? 50
}

function getConfidenceBadge(confidence: string): string {
  return confidenceConfig[confidence as keyof typeof confidenceConfig]?.badge ?? "bg-muted text-muted-foreground"
}

function getConfidenceBar(confidence: string): string {
  return confidenceConfig[confidence as keyof typeof confidenceConfig]?.bar ?? "bg-muted-foreground"
}

function getSuitableLabel(suitable: string): string {
  return suitableConfig[suitable as keyof typeof suitableConfig]?.label ?? suitable
}

function getSuitableBadge(suitable: string): string {
  return suitableConfig[suitable as keyof typeof suitableConfig]?.badge ?? "bg-muted text-muted-foreground"
}

function renderSuitableIcon(suitable: string): ReactNode {
  const className = "size-3.5"
  if (suitable === "yes") return <BadgeCheck className={className} />
  if (suitable === "no") return <XCircle className={className} />
  return <HelpCircle className={className} />
}

function renderCropIcon(cropName: string, className: string): ReactNode {
  const name = cropName.toLowerCase()
  const props = { className, strokeWidth: 1.5 }
  if (name.includes("frijol") || name.includes("arveja") || name.includes("lenteja")) return <Sprout {...props} />
  if (name.includes("lechuga") || name.includes("acelga") || name.includes("espinaca")) return <Leaf {...props} />
  if (name.includes("zanahoria")) return <Carrot {...props} />
  if (name.includes("trigo") || name.includes("cebada") || name.includes("maíz") || name.includes("maiz")) return <Wheat {...props} />
  if (name.includes("tomate") || name.includes("piment") || name.includes("aji") || name.includes("ají")) return <Sun {...props} />
  if (name.includes("papa") || name.includes("yuca") || name.includes("arracacha")) return <Mountain {...props} />
  if (name.includes("flor") || name.includes("rosa")) return <Flower2 {...props} />
  if (name.includes("café") || name.includes("cafe")) return <CircleDot {...props} />
  return <Sprout {...props} />
}

function renderSystemIcon(title: string, className: string): ReactNode {
  const name = title.toLowerCase()
  const props = { className, strokeWidth: 1.5 }
  if (name.includes("vivero")) return <Sprout {...props} />
  if (name.includes("goteo") || name.includes("riego")) return <Droplets {...props} />
  if (name.includes("eras") || name.includes("camellón") || name.includes("camellon")) return <LayoutGrid {...props} />
  if (name.includes("asociación") || name.includes("asociacion")) return <Leaf {...props} />
  if (name.includes("rotación") || name.includes("rotacion")) return <RefreshCw {...props} />
  if (name.includes("barrera") || name.includes("árbol") || name.includes("arbol") || name.includes("bosque")) return <TreeDeciduous {...props} />
  if (name.includes("drenaje")) return <Waves {...props} />
  if (name.includes("organiz") || name.includes("insumos")) return <ShieldCheck {...props} />
  return <Sun {...props} />
}

function renderSoilIcon(title: string, className: string): ReactNode {
  const name = title.toLowerCase()
  const props = { className, strokeWidth: 1.5 }
  if (name.includes("abono") || name.includes("orgánico") || name.includes("compost")) return <Recycle {...props} />
  if (name.includes("cobertura") || name.includes("mulch")) return <Layers {...props} />
  if (name.includes("labranza") || name.includes("arado")) return <Shovel {...props} />
  if (name.includes("plaga") || name.includes("biológico") || name.includes("biologico")) return <Bug {...props} />
  if (name.includes("tierra") || name.includes("suelo") || name.includes("mineral")) return <Mountain {...props} />
  if (name.includes("humedad") || name.includes("agua")) return <Droplets {...props} />
  if (name.includes("erosión") || name.includes("erosion")) return <Wind {...props} />
  if (name.includes("drenaje")) return <ArrowDownToLine {...props} />
  return <Shovel {...props} />
}

function getCropIconColor(cropName: string): string {
  const name = cropName.toLowerCase()
  if (name.includes("frijol") || name.includes("arveja")) return "bg-emerald-100 text-emerald-600"
  if (name.includes("lechuga") || name.includes("acelga") || name.includes("espinaca")) return "bg-lime-100 text-lime-600"
  if (name.includes("zanahoria")) return "bg-orange-100 text-orange-600"
  if (name.includes("trigo") || name.includes("cebada")) return "bg-yellow-100 text-yellow-600"
  if (name.includes("tomate")) return "bg-red-100 text-red-600"
  if (name.includes("papa")) return "bg-amber-100 text-amber-600"
  return "bg-primary/10 text-primary"
}

function makeBullet(text: string): string {
  // Truncate long explanations to keep cards scannable.
  return text.length > 120 ? `${text.slice(0, 120).trim()}...` : text
}

function AlternativeCropCard({ crop }: { crop: AiInsightsAlternativeCrop }) {
  const confidence = crop.confidence
  const percent = getConfidencePercent(confidence)
  return (
    <Card className="overflow-hidden border border-border/60 bg-card transition-shadow hover:shadow-md">
      <div className={cn("flex h-20 items-center justify-center", getCropIconColor(crop.cropName))}>
        {renderCropIcon(crop.cropName, "size-10")}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold leading-tight">{crop.cropName}</h4>
          <Badge variant="outline" className={cn("shrink-0 text-xs font-medium", getConfidenceBadge(confidence))}>
            {getConfidenceLabel(confidence)}
          </Badge>
        </div>
        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full", getConfidenceBar(confidence))} style={{ width: `${percent}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Confianza: {percent}%</p>
        </div>
        <p className="text-sm leading-snug text-muted-foreground line-clamp-3">{makeBullet(crop.why)}</p>
      </div>
    </Card>
  )
}

function FarmingSystemCard({ system }: { system: AiInsightsFarmingSystem }) {
  const suitable = system.suitable
  return (
    <Card className="border border-border/60 bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
          {renderSystemIcon(system.title, "size-5 text-primary")}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold leading-tight">{system.title}</h4>
            <div className={cn("flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium", getSuitableBadge(suitable))}>
              {renderSuitableIcon(suitable)}
              <span>{getSuitableLabel(suitable)}</span>
            </div>
          </div>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground line-clamp-3">
            {makeBullet(system.recommendation)}
          </p>
        </div>
      </div>
    </Card>
  )
}

function SoilCard({ item }: { item: AiInsightsSoilAndFertilizer }) {
  return (
    <Card className="border border-border/60 bg-card p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          {renderSoilIcon(item.title, "size-5 text-emerald-600")}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold leading-tight">{item.title}</h4>
          <p className="mt-1.5 text-sm leading-snug text-muted-foreground line-clamp-3">{makeBullet(item.content)}</p>
        </div>
      </div>
    </Card>
  )
}

export function AiInsightsPanel({ insights, loading, error, retryAttempt, municipalityName, onReload }: AiInsightsPanelProps) {
  console.log("[AiInsightsPanel] render:", { loading, error, retryAttempt, hasInsights: !!insights, status: insights?.status })

  const isRetrying = loading && retryAttempt && retryAttempt > 0

  if (loading) {
    return (
      <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6">
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <RefreshCw className={cn("size-6 text-primary", isRetrying && "animate-spin")} />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              {isRetrying ? "Reintentando recomendaciones de IA..." : "Cargando recomendaciones de IA..."}
            </p>
            <p className="text-xs text-muted-foreground">
              {isRetrying
                ? `Reintento ${retryAttempt} de 2. El servidor está tardando más de lo esperado.`
                : "Esto puede tardar unos segundos. Gracias por tu paciencia."}
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid grid-cols-3 gap-3 pt-2">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          </div>
          {onReload && isRetrying && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onReload}
            >
              <RefreshCw className="size-4" />
              Reintentar ahora
            </Button>
          )}
        </div>
      </Card>
    )
  }

  if (error || (insights && insights.status === "error")) {
    return (
      <Card className="relative overflow-hidden border border-destructive/20 bg-destructive/5 p-6">
        <div className="flex flex-col gap-3 text-sm text-destructive">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error || "No se pudieron generar las recomendaciones de IA."}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            No se pudieron cargar las recomendaciones de IA en este momento. Esto puede deberse a que el servidor está ocupado o alcanzó el límite de solicitudes.
          </p>
          {onReload && (
            <Button
              variant="outline"
              size="sm"
              className="w-fit gap-2 text-destructive hover:bg-destructive/10"
              onClick={onReload}
            >
              <RefreshCw className="size-4" />
              Reintentar
            </Button>
          )}
        </div>
      </Card>
    )
  }

  if (!insights) {
    return null
  }

  return (
    <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-5 sm:p-6">
      <div className="relative flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Image
              src="/ai%20images/agroplan.webp"
              alt="Asistente IA de Agroplan"
              width={40}
              height={40}
              className="size-9 rounded-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Recomendaciones con IA</h2>
              <Badge variant="secondary" className="text-xs">
                IA
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Análisis personalizado para <span className="font-medium text-foreground">{municipalityName || insights.municipalityName}</span>
            </p>
          </div>
        </div>

        {/* Summary */}
        {insights.summary && (
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-foreground">{insights.summary}</p>
            </div>
          </div>
        )}

        {/* Alternative crops */}
        {insights.alternativeCrops.length > 0 && (
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Sprout className="size-5 text-primary" />
              Cultivos alternativos recomendados
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {insights.alternativeCrops.map((crop, index) => (
                <AlternativeCropCard key={`${crop.cropName}-${index}`} crop={crop} />
              ))}
            </div>
          </section>
        )}

        {/* Farming systems */}
        {insights.farmingSystems.length > 0 && (
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Droplets className="size-5 text-primary" />
              Sistemas de producción recomendados
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {insights.farmingSystems.map((system, index) => (
                <FarmingSystemCard key={`${system.title}-${index}`} system={system} />
              ))}
            </div>
          </section>
        )}

        {/* Soil and fertilizer */}
        {insights.soilAndFertilizer.length > 0 && (
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <Shovel className="size-5 text-primary" />
              Manejo de suelo y fertilización
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {insights.soilAndFertilizer.map((item, index) => (
                <SoilCard key={`${item.title}-${index}`} item={item} />
              ))}
            </div>
          </section>
        )}

        {/* Footer metadata */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>Generado con {insights.model}</span>
          <span>·</span>
          <span>{insights.latencyMs != null ? `${insights.latencyMs}ms` : "—"}</span>
          <span>·</span>
          <span>{insights.tokensTotal != null ? `${new Intl.NumberFormat("es-CO").format(insights.tokensTotal)} tokens` : "Tokens no disponibles"}</span>
          <span>·</span>
          <span>{insights.generatedAt ? new Date(insights.generatedAt).toLocaleString("es-CO") : "Fecha no disponible"}</span>
        </div>
      </div>
    </Card>
  )
}
