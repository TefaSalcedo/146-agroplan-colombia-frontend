"use client"

import { FileText, FileDown, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function CropDownloadButtons({ cropName }: { cropName: string }) {
  function handle(label: string) {
    toast.success("Descarga lista", { description: `${label} de ${cropName} generado con datos de prueba.` })
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={() => handle("PDF")} className="flex-1 min-w-40" size="lg">
        <FileText className="size-4" />
        Descargar PDF
      </Button>
      <Button
        onClick={() => handle("Ficha técnica")}
        variant="secondary"
        className="flex-1 min-w-40"
        size="lg"
      >
        <FileDown className="size-4" />
        Ficha técnica
      </Button>
      <Button
        onClick={() => handle("Calendario")}
        variant="outline"
        className="flex-1 min-w-40"
        size="lg"
      >
        <CalendarDays className="size-4" />
        Calendario
      </Button>
    </div>
  )
}
