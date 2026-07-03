import { MapPin, Mountain } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Location } from "@/types"

export function LocationCard({ location }: { location: Location }) {
  return (
    <Card className="flex flex-row items-center gap-4 p-5">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MapPin className="size-7" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">Tu ubicación</p>
        <p className="truncate text-lg font-semibold">{location.municipality}</p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>{location.department}</span>
          <span aria-hidden>·</span>
          <Mountain className="size-3.5" />
          {location.altitude.toLocaleString("es-CO")} msnm
        </p>
      </div>
    </Card>
  )
}
