import Link from "next/link"
import { RecommendationBadge } from "@/components/recommendation-badge"
import { CropImage } from "@/components/crop-image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CropCardProps {
  id: string
  name: string
  image: string
  recommendation: "high" | "medium" | "low"
  successRate?: number
  href?: string
  statusLabel?: string
  className?: string
}

export function CropCard({ id, name, image, recommendation, successRate, href, statusLabel, className }: CropCardProps) {
  const targetHref = href ?? `/cultivos/${id}`
  return (
    <Link href={targetHref} className={cn("group block focus:outline-none", className)}>
      <Card className="overflow-hidden p-0 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-ring active:scale-95">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <CropImage
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="flex flex-col gap-2 p-3 transition-colors duration-200 group-hover:bg-primary/5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold leading-tight transition-colors duration-200 group-hover:text-primary">{name}</p>
            {typeof successRate === "number" && (
              <span className="text-sm font-semibold text-primary tabular-nums transition-transform duration-200 group-hover:scale-110">{successRate}%</span>
            )}
          </div>
          {statusLabel ? (
            <Badge variant="outline" className="font-medium border-primary/20 bg-primary/15 text-primary">
              {statusLabel}
            </Badge>
          ) : (
            <RecommendationBadge level={recommendation} />
          )}
        </div>
      </Card>
    </Link>
  )
}
