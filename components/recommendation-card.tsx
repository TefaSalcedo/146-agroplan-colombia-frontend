import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Crop } from "@/types"

export function RecommendationCard({ crop }: { crop: Crop }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid gap-0 sm:grid-cols-2">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted sm:aspect-auto sm:h-full sm:min-h-64">
          <Image
            src={crop.image || "/placeholder.svg"}
            alt={crop.name}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <Badge className="w-fit gap-1.5 bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" />
            Recomendado hoy
          </Badge>
          <div>
            <h2 className="text-2xl font-bold text-balance">{crop.name}</h2>
            <p className="text-sm italic text-muted-foreground">{crop.scientificName}</p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold tabular-nums text-primary">{crop.successRate ?? 0}%</span>
            <span className="pb-1.5 text-sm text-muted-foreground">probabilidad de éxito</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{crop.shortReason}</p>
          <Button
            size="lg"
            className="mt-auto w-full sm:w-fit"
            nativeButton={false}
            render={<Link href={`/cultivos/${crop.id}`} />}
          >
            Ver detalles
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
