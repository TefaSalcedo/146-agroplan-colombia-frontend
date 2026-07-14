import { useState, useEffect } from "react"
import {
  fetchCrops,
  fetchCrop,
  fetchCropsLite,
  fetchCropRecommendations,
  fetchCropNationalGuide,
} from "@/lib/api-client/crops"
import type { Crop } from "@/types"
import type {
  CropLite,
  CropNationalGuideResponse,
  CropRecommendationResponse,
} from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useCrops() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCrops = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCrops()
      setCrops(data)
    } catch (err) {
      setCrops([])
      setError(err instanceof ApiError ? err.message : "Error loading crops")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCrops()
  }, [])

  return { crops, loading, error, reload: loadCrops }
}

export function useCrop(id: string) {
  const [crop, setCrop] = useState<Crop | null>(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadCrop = async () => {
      if (!id) {
        setCrop(null)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setCrop(null)
      setError(null)
      try {
        const data = await fetchCrop(id)
        if (cancelled) return
        setCrop(data)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : "Error loading crop")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadCrop()

    return () => {
      cancelled = true
    }
  }, [id])

  return { crop, loading, error }
}

export function useCropsLite() {
  const [crops, setCrops] = useState<CropLite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCrops = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCropsLite()
      setCrops(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error loading crops")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCrops()
  }, [])

  return { crops, loading, error, reload: loadCrops }
}

export function useCropRecommendations(cropId: string, municipalityId: string) {
  const [recommendation, setRecommendation] = useState<CropRecommendationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!cropId || !municipalityId) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCropRecommendations(cropId, municipalityId)
        setRecommendation(data)
      } catch (err) {
        setRecommendation(null)
        setError(err instanceof ApiError ? err.message : "Error loading crop recommendations")
      } finally {
        setLoading(false)
      }

    }
    loadRecommendations()
  }, [cropId, municipalityId])

  return { recommendation, loading, error }
}

export function useCropNationalGuide(cropId: string) {
  const [guide, setGuide] = useState<CropNationalGuideResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    const loadGuide = async () => {
      if (!cropId) return
      setLoading(true)
      setError(null)
      try {
        setGuide(await fetchCropNationalGuide(cropId))
      } catch (err) {
        setGuide(null)
        setError(err instanceof ApiError ? err.message : "Error loading national crop guide")
      } finally {
        setLoading(false)
      }
    }

    loadGuide()
  }, [cropId, reloadKey])

  return { guide, loading, error, reload: () => setReloadKey((key) => key + 1) }
}
