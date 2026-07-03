"use client"

import { useState } from "react"
import {
  Download,
  Check,
  Loader2,
  FileText,
  FileSpreadsheet,
  Table2,
  Map,
  CalendarDays,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const iconMap = {
  FileText,
  FileSpreadsheet,
  Table2,
  Map,
  CalendarDays,
  BrainCircuit,
} satisfies Record<string, LucideIcon>

export type DownloadIcon = keyof typeof iconMap

interface DownloadCardProps {
  title: string
  description: string
  icon: DownloadIcon
  fileName: string
}

export function DownloadCard({ title, description, icon, fileName }: DownloadCardProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
  const Icon = iconMap[icon]

  function handleDownload() {
    if (status === "loading") return
    setStatus("loading")
    // Simulate generating a file with mock data
    setTimeout(() => {
      setStatus("done")
      toast.success("Descarga lista", { description: `${fileName} se generó correctamente.` })
      setTimeout(() => setStatus("idle"), 2000)
    }, 1200)
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-7" />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
      <Button onClick={handleDownload} disabled={status === "loading"} className="w-full" size="lg">
        {status === "loading" && <Loader2 className="size-4 animate-spin" />}
        {status === "done" && <Check className="size-4" />}
        {status === "idle" && <Download className="size-4" />}
        {status === "loading" ? "Generando..." : status === "done" ? "Descargado" : "Descargar"}
      </Button>
    </Card>
  )
}
