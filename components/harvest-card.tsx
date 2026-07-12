import Link from "next/link"
import { CropImage } from "@/components/crop-image"
import { Wheat } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface HarvestCardProps {
  id: string
  name: string
  image: string
  estimatedMonth: string
  daysRemaining: number | null
  maturity: number
  statusLabel: string
  href?: string
  className?: string
}

export function HarvestCard({
  id,
  name,
  image,
  estimatedMonth,
  daysRemaining,
  maturity,
  statusLabel,
  href,
  className,
}: HarvestCardProps) {
  const targetHref = href ?? `/cultivos/${id}`
  const isReady = maturity >= 100

  return (
    <Link href={targetHref} className={cn("group block w-56 shrink-0 focus:outline-none", className)}>
      <Card className="flex h-full flex-col overflow-hidden p-0 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-ring active:scale-95">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <CropImage
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            sizes="224px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Badge
            className={cn(
              "absolute left-3 top-3 gap-1 font-medium",
              isReady
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground"
            )}
          >
            <Wheat className="size-3.5" />
            {statusLabel}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4 transition-colors duration-200 group-hover:bg-primary/5">
          <p className="font-semibold leading-tight transition-colors duration-200 group-hover:text-primary">
            {name}
          </p>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Cosecha estimada</p>
            <p className="text-sm font-medium">{estimatedMonth}</p>
          </div>
          {daysRemaining !== null && (
            <p className="text-sm text-muted-foreground">
              {daysRemaining === 0 ? "Lista para cosechar" : `${daysRemaining} día${daysRemaining === 1 ? "" : "s"} restantes`}
            </p>
          )}
          <div className="mt-auto pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Madurez</span>
                <span className="font-medium tabular-nums">{maturity}%</span>
              </div>
              <Progress value={maturity}>
                <ProgressTrack>
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
