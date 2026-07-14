import { useState, useEffect, useCallback, useRef } from "react"
import { fetchAiInsights } from "@/lib/api-client/ai-insights"
import type { AiInsightsResponse } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

const MAX_RETRIES = 2
const REQUEST_TIMEOUT_MS = 10000
const RETRY_DELAY_MS = 2000

function isAbortError(err: unknown): boolean {
  return err instanceof Error && (err.name === "AbortError" || /abort/i.test(err.message))
}

function getRetryErrorMessage(err: unknown, attempt: number, maxAttempts: number): string {
  if (err instanceof ApiError) {
    if (err.status === 500) {
      return `El servidor respondió con error 500. Reintentando automáticamente (${attempt + 1}/${maxAttempts})...`
    }
    if (err.status === 429) {
      return "Hay muchas solicitudes en este momento. Por favor espera un momento y vuelve a intentar."
    }
    if (err.status === 503 || err.status === 502) {
      return `El servicio de IA está temporalmente no disponible. Reintentando automáticamente (${attempt + 1}/${maxAttempts})...`
    }
    if (err.status === 404) {
      return "No se encontraron recomendaciones de IA para este municipio."
    }
    if (err.status === 408) {
      return `La consulta tardó demasiado. Reintentando automáticamente (${attempt + 1}/${maxAttempts})...`
    }
    return `No fue posible cargar las recomendaciones. Reintentando automáticamente (${attempt + 1}/${maxAttempts})...`
  }

  if (isAbortError(err)) {
    return `La consulta tardó más de lo esperado. Reintentando automáticamente (${attempt + 1}/${maxAttempts})...`
  }

  return `Error al cargar las recomendaciones de IA. Reintentando automáticamente (${attempt + 1}/${maxAttempts})...`
}

function getFinalErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 500) {
      return "El servidor respondió con error 500. No se pudieron cargar las recomendaciones de IA después de varios intentos."
    }
    if (err.status === 429) {
      return "Hay muchas solicitudes en este momento. Por favor espera un momento y vuelve a intentar."
    }
    if (err.status === 503 || err.status === 502) {
      return "El servicio de IA está temporalmente no disponible. Por favor intenta más tarde."
    }
    if (err.status === 404) {
      return "No se encontraron recomendaciones de IA para este municipio."
    }
    if (err.status === 408) {
      return "La consulta tardó demasiado. El servicio de IA no respondió a tiempo."
    }
    return "No fue posible cargar las recomendaciones. Por favor, inténtalo de nuevo."
  }

  if (isAbortError(err)) {
    return "La consulta tardó demasiado. El servicio de IA no respondió a tiempo."
  }

  return "Error al cargar las recomendaciones de IA."
}

export function useAiInsights(municipalityId: string) {
  const [insights, setInsights] = useState<AiInsightsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
  }, [])

  const loadInsights = useCallback(async (id: string, attempt = 0) => {
    if (!id) {
      return
    }

    setLoading(true)
    setError(null)
    setRetryAttempt(attempt)

    // Abort any previous request to avoid race conditions.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    const timeoutId = setTimeout(() => {
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const data = await fetchAiInsights(id, { signal: controller.signal })
      clearTimeout(timeoutId)
      setInsights(data)
      setError(null)
      setRetryAttempt(0)
    } catch (err) {
      clearTimeout(timeoutId)

      // Ignore cancellations caused by navigation or component unmount.
      if (controller.signal.aborted && abortControllerRef.current !== controller) {
        return
      }

      console.error(`[useAiInsights] Error fetching AI insights on attempt ${attempt + 1}:`, err)

      const isRetryable =
        (err instanceof ApiError && (err.status === 500 || err.status === 503 || err.status === 502 || err.status === 408)) ||
        isAbortError(err)
      const shouldRetry = isRetryable && attempt < MAX_RETRIES

      if (shouldRetry) {
        const errorMessage = getRetryErrorMessage(err, attempt + 1, MAX_RETRIES + 1)
        setError(errorMessage)
        retryTimeoutRef.current = setTimeout(() => {
          retryTimeoutRef.current = null
          loadInsights(id, attempt + 1)
        }, RETRY_DELAY_MS)
        // Keep loading true while retrying.
        return
      }

      const finalMessage = getFinalErrorMessage(err)
      setInsights(null)
      setError(finalMessage)
      setRetryAttempt(0)
    } finally {
      if (!retryTimeoutRef.current) {
        setLoading(false)
      }
    }
  }, [])

  const reload = useCallback((id?: string) => {
    clearRetryTimeout()
    const targetId = id ?? municipalityId
    loadInsights(targetId, 0)
  }, [clearRetryTimeout, loadInsights, municipalityId])

  useEffect(() => {
    loadInsights(municipalityId, 0)
    return () => {
      clearRetryTimeout()
      if (abortControllerRef.current) {
        const controller = abortControllerRef.current
        abortControllerRef.current = null
        controller.abort()
      }
    }
  }, [municipalityId, loadInsights, clearRetryTimeout])

  return { insights, loading, error, retryAttempt, reload }
}
