"use client"

import Link from "next/link"
import {
  ArrowLeft,
  CalendarDays,
  Info,
  Trophy,
} from "lucide-react"
import { CropImage } from "@/components/crop-image"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Crop } from "@/types"
import type { CropLite } from "@/lib/api-client/types"

interface CropMapSidebarProps {
  crop: Crop | null
  crops: CropLite[]
  selectedCropId: string
  onCropChange: (cropId: string) => void
  backHref?: string
  contestHref?: string
}

const monthLabels = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]

export function CropMapSidebar({
  crop,
  crops,
  selectedCropId,
  onCropChange,
  backHref = "/",
  contestHref = "/concurso",
}: CropMapSidebarProps) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href={backHref}
        className="flex w-fit items-center gap-2 px-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </Link>

      <div className="space-y-2">
        <label htmlFor="crop-map-selector" className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cambiar cultivo
        </label>
        <Select
          value={selectedCropId}
          onValueChange={onCropChange}
          disabled={crops.length === 0}
          items={Object.fromEntries(crops.map((item) => [item.id, item.name]))}
        >
          <SelectTrigger id="crop-map-selector" className="w-full bg-background/70">
            <SelectValue placeholder={crops.length === 0 ? "Cargando cultivos..." : "Selecciona un cultivo"} />
          </SelectTrigger>
          <SelectContent>
            {crops.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <CropImage
            src={crop?.image || "/placeholder.svg"}
            alt={crop?.name || "Cultivo"}
            fill
            sizes="(max-width: 768px) 100vw, 280px"
            className="object-cover"
            priority
          />
        </div>
      </Card>

      {crop && (
        <>
          <Card id="crop-calendar-section" className="border-2 p-4">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarDays className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold">Calendario de siembra</h2>
                  <p className="text-xs text-muted-foreground">Mejores épocas</p>
                </div>
              </div>
              <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                {crop.plantingMonths.length} meses
              </span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="grid grid-cols-12 gap-1 text-[10px] font-bold text-muted-foreground">
                  {monthLabels.map((month, index) => (
                    <div key={`${month}-${index}`} className="text-center">
                      {month}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-12 gap-1">
                  {monthLabels.map((_, index) => {
                    const isActive = crop.plantingMonths.includes(index + 1)
                    return (
                      <div
                        key={index}
                        className={cn("h-5 rounded-sm", isActive ? "bg-primary shadow-sm" : "bg-muted/40")}
                        title={isActive ? `Mes ${index + 1}: Recomendado` : `Mes ${index + 1}: No recomendado`}
                        role="gridcell"
                        aria-label={`Mes ${index + 1}: ${isActive ? "Recomendado" : "No recomendado"}`}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1 rounded-lg bg-muted/30 p-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded bg-primary" />
                  <span>Época ideal de siembra</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-3 rounded bg-muted/40" />
                  <span>No recomendado</span>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-2 text-xs dark:bg-blue-950/30">
                <Info className="mt-0.5 size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
                <p className="text-muted-foreground">Siembra en los meses marcados para mejores resultados.</p>
              </div>
            </div>
          </Card>

        </>
      )}

      <Link
        href={contestHref}
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
      >
        <Trophy className="size-4 shrink-0" />
        <span className="min-w-0">
          <span className="block">Datos al ecosistema 2026</span>
          <span className="block truncate text-[11px] text-white/80">Concurso Datos Abiertos</span>
        </span>
      </Link>
    </div>
  )
}
