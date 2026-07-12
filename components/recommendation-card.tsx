import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowRight, CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RecommendationBadge } from "@/components/recommendation-badge"
import type { Crop } from "@/types"

interface RecommendationCardProps {
  crop: Crop
  href?: string
  plantingWindowLabel?: string
  title?: string
}

export function RecommendationCard({ crop, href, plantingWindowLabel, title = "Hoy puedes sembrar" }: RecommendationCardProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 md:grid-cols-2">
        <div className="flex flex-col gap-5 p-6 md:p-8">
          <Badge className="w-fit gap-1.5 bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" />
            Recomendado hoy
          </Badge>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">{crop.name}</h2>
            <p className="text-sm italic text-muted-foreground">{crop.scientificName}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-4xl font-bold tabular-nums text-primary">{crop.successRate ?? 0}%</span>
              <span className="text-xs text-muted-foreground">Probabilidad de éxito</span>
            </div>
            <RecommendationBadge level={crop.recommendation} />
          </div>
          {plantingWindowLabel ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4 text-primary" />
              <span>Siembra ideal entre {plantingWindowLabel}</span>
            </div>
          ) : null}
          <Button
            size="lg"
            className="mt-auto w-full md:w-fit"
            nativeButton={false}
            render={<Link href={href ?? `/cultivos/${crop.id}`} />}
          >
            Ver detalles del cultivo
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted md:aspect-auto md:h-full md:min-h-64">
          <Image
            src={crop.image || "/placeholder.svg"}
            alt={crop.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </Card>
  )
}
