"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { MapPin, Languages, Moon, Sun } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { municipalities } from "@/lib/mock-data"

export function SettingsControls() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [municipalityId, setMunicipalityId] = useState(municipalities[0].id)
  const [language, setLanguage] = useState("es")

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = theme === "dark"

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-row items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MapPin className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Ubicación</p>
          <p className="text-sm text-muted-foreground">Tu municipio principal</p>
        </div>
        <Select
          value={municipalityId}
          onValueChange={setMunicipalityId}
          items={Object.fromEntries(municipalities.map((m) => [m.id, m.name]))}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {municipalities.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="flex flex-row items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Languages className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Idioma</p>
          <p className="text-sm text-muted-foreground">Idioma de la aplicación</p>
        </div>
        <Select
          value={language}
          onValueChange={setLanguage}
          items={{ es: "Español", en: "English" }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      <Card className="flex flex-row items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium">Tema oscuro</p>
          <p className="text-sm text-muted-foreground">Cambia entre claro y oscuro</p>
        </div>
        {mounted && (
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Activar tema oscuro"
          />
        )}
      </Card>
    </div>
  )
}
