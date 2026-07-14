"use client"

import { useEffect, useRef, useState } from "react"
import { Square, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ActiveSpeech = {
  stop: () => void
}

let activeSpeech: ActiveSpeech | null = null

function stopActiveSpeech() {
  activeSpeech?.stop()
  activeSpeech = null
}

function getSpanishVoice(voices: SpeechSynthesisVoice[]) {
  return (
    voices.find((voice) => voice.lang.toLowerCase() === "es-co") ??
    voices.find((voice) => voice.lang.toLowerCase() === "es-419") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("es-")) ??
    voices.find((voice) => voice.lang.toLowerCase() === "es")
  )
}

interface TextToSpeechControlsProps {
  text: string
  className?: string
  label?: string
}

export function TextToSpeechControls({
  text,
  className,
  label = "Escuchar contenido",
}: TextToSpeechControlsProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const speechIdRef = useRef<symbol | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return

    setIsSupported(true)
    const synthesis = window.speechSynthesis
    const updateVoices = () => setVoices(synthesis.getVoices())
    updateVoices()
    synthesis.addEventListener("voiceschanged", updateVoices)

    return () => {
      synthesis.removeEventListener("voiceschanged", updateVoices)
      if (speechIdRef.current) {
        stopActiveSpeech()
        speechIdRef.current = null
      }
    }
  }, [])

  if (!isSupported || !text.trim()) return null

  const stop = () => {
    if (speechIdRef.current) {
      stopActiveSpeech()
      speechIdRef.current = null
      setIsSpeaking(false)
    }
  }

  const speak = () => {
    const synthesis = window.speechSynthesis
    const speechId = Symbol("speech")
    const utterance = new SpeechSynthesisUtterance(text.trim())
    const voice = getSpanishVoice(voices)

    stopActiveSpeech()
    setIsSpeaking(true)
    speechIdRef.current = speechId

    utterance.lang = voice?.lang ?? "es-CO"
    if (voice) utterance.voice = voice
    utterance.rate = 0.95
    utterance.pitch = 1

    const finish = () => {
      if (speechIdRef.current !== speechId) return
      speechIdRef.current = null
      setIsSpeaking(false)
      activeSpeech = null
    }

    utterance.onend = finish
    utterance.onerror = finish
    activeSpeech = {
      stop: () => {
        synthesis.cancel()
        if (speechIdRef.current === speechId) {
          speechIdRef.current = null
          setIsSpeaking(false)
        }
      },
    }
    synthesis.cancel()
    synthesis.speak(utterance)
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {!isSpeaking ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={speak}
          aria-label={label}
          title={label}
        >
          <Volume2 className="size-4" aria-hidden="true" />
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={stop}
          aria-label="Detener lectura"
          title="Detener lectura"
          aria-pressed="true"
        >
          <Square className="size-3.5 fill-current" aria-hidden="true" />
        </Button>
      )}
      <span className="sr-only" aria-live="polite">
        {isSpeaking ? "Reproduciendo contenido" : ""}
      </span>
    </div>
  )
}
