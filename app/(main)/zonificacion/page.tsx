"use client"

import { useMemo, useState, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { X, Thermometer, CloudRain, Mountain, ArrowRight, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadPdfButton } from "@/components/download-pdf-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SuitabilityBadge } from "@/components/recommendation-badge"
import { suitabilityColors, getSuitabilityLabel } from "@/lib/mock-data"
import { api, ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"
import type { Municipality, Suitability, Crop } from "@/types"

const ZonificationMap = dynamic(
  () => import("@/components/zonification-map").then((m) => m.ZonificationMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-none" />,
  },
)

const LAYERS: { key: Suitability; label: string }[] = [
  { key: "high", label: "Alta" },
  { key: "medium", label: "Media" },
  { key: "low", label: "Baja" },
  { key: "none", label: "No apta" },
]

export default function ZonificacionPage() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [cropId, setCropId] = useState<string>("")
  const [selected, setSelected] = useState<Municipality | null>(null)
  const [selectedSuitability, setSelectedSuitability] = useState<Suitability | null>(null)
  const [activeLayers, setActiveLayers] = useState<Record<Suitability, boolean>>({
    high: true,
    medium: true,
    low: true,
    none: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selected && cropId) {
      loadZoningPrediction(selected.id, cropId)
    }
  }, [selected, cropId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [cropsData, municipalitiesData] = await Promise.all([
        api.crops.list(),
        api.municipalities.list(),
      ])
      setCrops(cropsData)
      setMunicipalities(municipalities)
      if (cropsData.length > 0) {
        setCropId(cropsData[0].id)
      }
    } catch (err) {
      console.error('Error loading data:', err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Error loading data')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadZoningPrediction = async (municipalityId: string, cropId: string) => {
    try {
      const prediction = await api.zoning.predict({
        crop_id: cropId,
        municipality_id: municipalityId,
      })
      setSelectedSuitability(prediction.suitability)
    } catch (err) {
      console.error('Error loading zoning prediction:', err)
      setSelectedSuitability("none")
    }
  }

  function toggleLayer(key: Suitability) {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando datos de zonificación...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Zonificación</h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Explora dónde crece mejor cada cultivo en tu región.
          </p>
        </div>
        <DownloadPdfButton pageName="Zonificación" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={cropId}
          onValueChange={setCropId}
          items={Object.fromEntries(crops.map((c) => [c.id, c.name]))}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Elige un cultivo" />
          </SelectTrigger>
          <SelectContent>
            {crops.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-wrap gap-2">
          {LAYERS.map((layer) => {
            const active = activeLayers[layer.key]
            return (
              <button
                key={layer.key}
                type="button"
                onClick={() => toggleLayer(layer.key)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-border bg-card text-foreground"
                    : "border-transparent bg-muted text-muted-foreground line-through",
                )}
              >
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: suitabilityColors[layer.key] }}
                  aria-hidden
                />
                {layer.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative h-[60vh] min-h-[420px] overflow-hidden rounded-3xl border border-border">
        <ZonificationMap
          cropId={cropId}
          activeLayers={activeLayers}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
        />

        {!selected && (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
            <span className="pointer-events-auto flex items-center gap-2 rounded-full bg-card/95 px-4 py-2 text-sm text-muted-foreground shadow-md backdrop-blur">
              <MapPin className="size-4" />
              Toca un municipio para ver detalles
            </span>
          </div>
        )}

        {selected && selectedSuitability && (
          <Card className="absolute inset-x-4 bottom-4 z-[1000] gap-3 p-5 shadow-xl md:inset-x-auto md:right-4 md:top-4 md:bottom-auto md:w-80 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-lg font-semibold leading-tight">{selected.name}</p>
                <p className="text-sm text-muted-foreground">{selected.department}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Cerrar"
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {crops.find((c) => c.id === cropId)?.name}:
              </span>
              <SuitabilityBadge level={selectedSuitability} />
            </div>

            <dl className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="size-4" /> Temperatura
                </dt>
                <dd className="font-medium">{selected.avgTemperature} °C</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <CloudRain className="size-4" /> Precipitación
                </dt>
                <dd className="font-medium">{(selected.precipitation || 0).toLocaleString("es-CO")} mm</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Mountain className="size-4" /> Altitud
                </dt>
                <dd className="font-medium">{selected.altitude.toLocaleString("es-CO")} msnm</dd>
              </div>
            </dl>

            <Button
              className="w-full"
              render={
                <Link href="/cultivos">
                  Ver cultivos recomendados
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
          </Card>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Datos de aptitud simulados con el modelo de zonificación agroclimática. La leyenda usa colores:{" "}
        {LAYERS.map((l) => getSuitabilityLabel(l.key)).join(", ")}.
      </p>
    </div>
  )
}
