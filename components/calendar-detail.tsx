"use client"

import { useMemo } from "react"
import { AlertTriangle, Calendar, CloudSun, Droplets, Sprout, Thermometer, TrendingUp, Wheat } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CropImage } from "@/components/crop-image"
import { TextToSpeechControls } from "@/components/text-to-speech-controls"
import { MONTHS_LONG } from "@/lib/constants"
import type {
  CalendarBatchResponse,
  CalendarCropResult,
  CalendarHarvestWindow,
  CalendarMonthlyForecast,
} from "@/lib/api-client/types"

interface CalendarDetailProps {
  batchResponse: CalendarBatchResponse | null
}

function formatNumber(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined) return "--"
  return value.toFixed(digits)
}

function formatScore(score: number): string {
  return `${(score * 100).toFixed(0)}%`
}

function formatDuration(min: number | null | undefined, max: number | null | undefined): string {
  if (min === null || min === undefined) return ""
  if (max === null || max === undefined || min === max) return `${min} días`
  return `${min} - ${max} días`
}

function confidenceLabel(confidence: string | null | undefined): string {
  switch (confidence) {
    case "high":
      return "Alta"
    case "medium":
      return "Media"
    case "low":
      return "Baja"
    default:
      return "Desconocida"
  }
}

function confidenceVariant(confidence: string | null | undefined): "default" | "secondary" | "outline" | "destructive" | "ghost" | "link" {
  switch (confidence) {
    case "high":
      return "default"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "secondary"
  }
}

function HarvestWindowCard({ window }: { window: CalendarHarvestWindow }) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wheat className="size-4 text-amber-500" />
          <span className="font-medium">
            {window.harvestMonthName} {window.harvestYear}
          </span>
        </div>
        <Badge variant="default">Score: {formatScore(window.score)}</Badge>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sprout className="size-4 text-emerald-500" />
        <span>
          Siembra: {" "}
          {window.plantingMonths.map((m) => MONTHS_LONG[m - 1]).join(", ")} {window.plantingYear}
        </span>
      </div>

      {window.durationDaysMin && (
        <div className="text-xs text-muted-foreground">
          Duración: {formatDuration(window.durationDaysMin, window.durationDaysMax)}
        </div>
      )}
    </div>
  )
}

function MonthlyForecastTable({ forecasts }: { forecasts: CalendarMonthlyForecast[] }) {
  const availableForecasts = useMemo(
    () => forecasts.filter((f) => f.climateSource !== "not_available"),
    [forecasts]
  )

  if (availableForecasts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay pronóstico climático mensual disponible para este periodo.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-medium text-muted-foreground">
            <th className="py-2 pr-4">Mes</th>
            <th className="py-2 pr-4">Fuente</th>
            <th className="py-2 pr-4">
              <span className="inline-flex items-center gap-1">
                <Thermometer className="size-3" />
                Temp. media
              </span>
            </th>
            <th className="py-2 pr-4">
              <span className="inline-flex items-center gap-1">
                <Droplets className="size-3" />
                Precipitación
              </span>
            </th>
            <th className="py-2 pr-4">Humedad</th>
          </tr>
        </thead>
        <tbody>
          {availableForecasts.map((forecast) => (
            <tr key={`${forecast.year}-${forecast.month}`} className="border-b last:border-b-0">
              <td className="py-2 pr-4 font-medium">
                {MONTHS_LONG[forecast.month - 1]} {forecast.year}
              </td>
              <td className="py-2 pr-4">
                <Badge variant="outline" className="text-[10px]">
                  {forecast.climateSource}
                </Badge>
              </td>
              <td className="py-2 pr-4 tabular-nums">{formatNumber(forecast.tempMean, 1)}°C</td>
              <td className="py-2 pr-4 tabular-nums">{formatNumber(forecast.precipitation, 1)} mm</td>
              <td className="py-2 pr-4 tabular-nums">{formatNumber(forecast.humidity, 1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CropTabContent({ result }: { result: CalendarCropResult }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h3 className="font-semibold">Predicción de rendimiento</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums">
              {formatNumber(result.yieldPrediction, 2)}
            </span>
            <span className="text-muted-foreground">toneladas/hectárea</span>
          </div>
          {result.yieldConfidence && (
            <Badge variant={confidenceVariant(result.yieldConfidence)} className="w-fit">
              Confianza: {confidenceLabel(result.yieldConfidence)}
            </Badge>
          )}
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            <h3 className="font-semibold">Método</h3>
          </div>
          <p className="text-sm text-muted-foreground capitalize">{result.method ?? "No informado"}</p>
        </Card>
      </div>

      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <Wheat className="size-5 text-amber-500" />
          <h3 className="font-semibold">Ventanas de cosecha recomendadas</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.topHarvestMonths.map((window, index) => (
            <HarvestWindowCard key={`${window.harvestYear}-${window.harvestMonth}-${index}`} window={window} />
          ))}
        </div>
      </Card>

      {result.explanation?.text && (
        <Card className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CloudSun className="size-5 text-primary" />
              <h3 className="font-semibold">Análisis inteligente</h3>
            </div>
            <TextToSpeechControls text={result.explanation.text} />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{result.explanation.text}</p>
          {result.explanation.model && (
            <div className="text-xs text-muted-foreground">
              Modelo: {result.explanation.model}
              {result.explanation.provider && ` · ${result.explanation.provider}`}
              {result.explanation.latencyMs && ` · ${result.explanation.latencyMs}ms`}
            </div>
          )}
        </Card>
      )}

      {result.warnings.length > 0 && (
        <Card className="border-amber-200 bg-amber-50 p-5">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-700" />
            <h4 className="font-medium text-amber-900">Advertencias</h4>
          </div>
          <ul className="space-y-1 text-sm text-amber-800">
            {result.warnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2">
          <CloudSun className="size-5 text-blue-500" />
          <h3 className="font-semibold">Pronóstico climático mensual</h3>
        </div>
        <MonthlyForecastTable forecasts={result.monthlyForecasts} />
      </Card>
    </div>
  )
}

export function CalendarDetail({ batchResponse }: CalendarDetailProps) {
  if (!batchResponse || !batchResponse.results.length) {
    return null
  }

  const { results, municipalityName, horizonMonths, modelVersion } = batchResponse
  const defaultTab = results[0].cropId

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-primary" />
          <h2 className="text-base font-semibold">Detalle del calendario</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Calendario agrícola para <span className="font-medium text-foreground">{municipalityName}</span> a{" "}
          {horizonMonths} meses.
        </p>
        <p className="text-xs text-muted-foreground">Versión del modelo: {modelVersion}</p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <Card key={result.cropId} className="flex flex-col gap-3 p-5">
            <div className="flex items-center gap-3">
              <div className="relative size-10 overflow-hidden rounded-lg bg-muted">
                <CropImage src={`/crops/${result.cropId}.png`} alt={result.cropName} fill sizes="40px" />
              </div>
              <div>
                <p className="font-medium">{result.cropName}</p>
                <p className="text-2xl font-bold tabular-nums">
                  {formatNumber(result.yieldPrediction, 2)}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">t/ha</span>
                </p>
              </div>
            </div>
            {result.yieldConfidence && (
              <Badge variant={confidenceVariant(result.yieldConfidence)} className="w-fit">
                Confianza: {confidenceLabel(result.yieldConfidence)}
              </Badge>
            )}
          </Card>
        ))}
      </div>

      {results.length > 1 ? (
        <Tabs defaultValue={defaultTab}>
          <TabsList variant="line" className="h-auto w-full flex-wrap">
            {results.map((result) => (
              <TabsTrigger key={result.cropId} value={result.cropId} className="flex-1">
                {result.cropName}
              </TabsTrigger>
            ))}
          </TabsList>
          {results.map((result) => (
            <TabsContent key={result.cropId} value={result.cropId}>
              <CropTabContent result={result} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <CropTabContent result={results[0]} />
      )}
    </div>
  )
}
