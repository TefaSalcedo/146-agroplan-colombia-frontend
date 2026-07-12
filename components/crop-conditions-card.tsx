"use client"

import {
  AlertCircle,
  CloudRain,
  Droplets,
  Layers,
  Mountain,
  Thermometer,
  Waves,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Crop } from "@/types"

interface CropConditionsCardProps {
  crop: Crop
  glass?: boolean
}

export function CropConditionsCard({ crop, glass = false }: CropConditionsCardProps) {
  const cropFacts = [
    { icon: Thermometer, label: "Temperatura ideal", value: crop.idealTemperature },
    { icon: Droplets, label: "Humedad", value: crop.humidity },
    { icon: CloudRain, label: "Precipitación", value: crop.precipitation },
    { icon: Mountain, label: "Altitud", value: crop.altitude },
    { icon: Layers, label: "Tipo de suelo", value: crop.soilType },
    { icon: Waves, label: "Riego", value: crop.irrigation },
  ]

  return (
    <Card
      id={glass ? undefined : "crop-temperature-section"}
      className={
        glass
          ? "border-white/40 bg-background/45 p-4 text-foreground shadow-xl backdrop-blur-2xl"
          : "border-2 p-4"
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Thermometer className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold">Condiciones ideales</h2>
          <p className="text-xs text-muted-foreground">Requisitos del cultivo</p>
        </div>
      </div>

      <div className="space-y-2">
        {cropFacts.map((fact) => {
          const Icon = fact.icon
          return (
            <div key={fact.label} className="flex items-start gap-2 rounded-lg border border-border/50 bg-muted/30 p-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">{fact.label}</p>
                <p className="text-sm font-bold">{fact.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs dark:bg-amber-950/30">
        <AlertCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-muted-foreground">Las condiciones locales pueden variar.</p>
      </div>
    </Card>
  )
}
