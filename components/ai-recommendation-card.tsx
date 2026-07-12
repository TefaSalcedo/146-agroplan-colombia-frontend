"use client"

import { Sparkles, Sprout, Lightbulb, ClipboardCheck, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { CropRecommendationResponse } from "@/lib/api-client/types"

interface ParsedRecommendation {
  summary: string
  sections: { title: string; items: string[] }[]
}

function parseRecommendationText(text: string): ParsedRecommendation {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const sections: { title: string; items: string[] }[] = []
  let currentSection: { title: string; items: string[] } | null = null
  let summary = ""

  const sectionHeaders = [
    "recomendación",
    "recomendaciones",
    "consejos",
    "buenas prácticas",
    "prácticas recomendadas",
    "condiciones",
    "condiciones ideales",
    "observaciones",
    "advertencias",
    "riesgos",
    "cuidados",
    "manejo",
    "siembra",
    "cosecha",
    "fertilización",
    "riego",
    "plagas",
    "enfermedades",
  ]

  for (const line of lines) {
    const isHeader =
      line.match(/^#{1,3}\s+(.+)$/) ||
      (line.endsWith(":") && sectionHeaders.some((h) => line.toLowerCase().includes(h))) ||
      sectionHeaders.some((h) => line.toLowerCase() === h)

    if (isHeader) {
      const title = line.replace(/^#{1,3}\s+/, "").replace(/:$/, "").trim()
      currentSection = { title, items: [] }
      sections.push(currentSection)
      continue
    }

    const cleaned = line.replace(/^[-*•]\s*/, "").trim()
    if (!cleaned) continue

    if (!currentSection) {
      summary += (summary ? " " : "") + cleaned
    } else {
      currentSection.items.push(cleaned)
    }
  }

  return { summary, sections }
}

interface AIRecommendationCardProps {
  cropId: string
  cropName: string
  municipalityId: string
  municipalityName: string
  recommendation?: CropRecommendationResponse | null
  loading?: boolean
  error?: string | null
}

export function AIRecommendationCard({
  cropName,
  municipalityName,
  recommendation,
  loading,
  error,
}: AIRecommendationCardProps) {
  const parsed = recommendation?.text ? parseRecommendationText(recommendation.text) : null

  return (
    <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background p-6">
      <div className="absolute right-0 top-0 p-4 opacity-10">
        <Sparkles className="size-24 text-primary" />
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Recomendación Inteligente IA</h2>
              <Badge variant="secondary" className="text-xs">
                IA
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Recomendación personalizada para <span className="font-medium text-foreground">{cropName}</span> en{" "}
              <span className="font-medium text-foreground">{municipalityName}</span>
            </p>
          </div>
        </div>

        {loading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        )}

        {error && !loading && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && parsed && (
          <div className="space-y-4">
            {parsed.summary && (
              <p className="text-sm leading-relaxed text-foreground">{parsed.summary}</p>
            )}

            {parsed.sections.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {parsed.sections.slice(0, 4).map((section, index) => (
                  <div
                    key={section.title + index}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      {index === 0 ? (
                        <Sprout className="size-4 text-primary" />
                      ) : index === 1 ? (
                        <Lightbulb className="size-4 text-amber-500" />
                      ) : index === 2 ? (
                        <ClipboardCheck className="size-4 text-emerald-500" />
                      ) : (
                        <Sparkles className="size-4 text-violet-500" />
                      )}
                      <h3 className="text-sm font-semibold">{section.title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {section.items.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!loading && !error && !parsed && (
          <p className="text-sm text-muted-foreground">
            Aún no hay una recomendación generada para este cultivo en tu municipio.
          </p>
        )}

        {recommendation?.model && (
          <p className="text-xs text-muted-foreground">
            Generado con {recommendation.model}
            {recommendation.latencyMs ? ` · ${recommendation.latencyMs}ms` : ""}
          </p>
        )}
      </div>
    </Card>
  )
}
