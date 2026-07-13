"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const DEFAULT_MESSAGES = [
  "Pensando...",
  "Analizando la información...",
  "Buscando datos relevantes...",
  "Investigando...",
  "Preparando la respuesta ...",
  "Organizando la información...",
  "Escribiendo la recomendación...",
  "Generando el análisis...",
  "Revisando los datos...",
  "Casi listo...",
]

interface DynamicAiLoadingMessageProps {
  isLoading: boolean
  messages?: string[]
  intervalMs?: number
  className?: string
}

export function DynamicAiLoadingMessage({
  isLoading,
  messages = DEFAULT_MESSAGES,
  intervalMs = 2800,
  className,
}: DynamicAiLoadingMessageProps) {
  const availableMessages = messages.length > 0 ? messages : DEFAULT_MESSAGES
  const [messageIndex, setMessageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (!isLoading) return

    setMessageIndex(0)
    setIsVisible(true)

    let fadeTimer: ReturnType<typeof setTimeout> | undefined
    const rotationTimer = setInterval(() => {
      setIsVisible(false)
      fadeTimer = setTimeout(() => {
        setMessageIndex((currentIndex) => (currentIndex + 1) % availableMessages.length)
        setIsVisible(true)
      }, 180)
    }, intervalMs)

    return () => {
      clearInterval(rotationTimer)
      if (fadeTimer) clearTimeout(fadeTimer)
    }
  }, [isLoading, intervalMs, availableMessages.length])

  if (!isLoading) return null

  return (
    <div
      className={cn("flex items-center justify-center gap-2 text-sm font-medium text-foreground", className)}
      role="status"
      aria-live="polite"
    >
      <Sparkles className="size-4 shrink-0 text-primary" aria-hidden="true" />
      <span className={cn("transition-opacity duration-200 motion-reduce:transition-none", isVisible ? "opacity-100" : "opacity-0")}>
        {availableMessages[messageIndex % availableMessages.length]}
      </span>
    </div>
  )
}
