"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function SettingsControls() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && theme === "dark"

  return (
    <div className="flex flex-col gap-4">



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
