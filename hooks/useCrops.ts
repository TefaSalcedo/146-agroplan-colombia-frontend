import { useState, useEffect } from "react"
import { fetchCrops, fetchCrop, fetchCropsLite } from "@/lib/api-client/crops"
import type { Crop } from "@/types"
import type { CropLite } from "@/lib/api-client/types"
import { ApiError } from "@/lib/api-client/client"

export function useCrops() {
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(false)
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCrop = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchCrop(id)
        setCrop(data)
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Error loading crop")
      } finally {
        setLoading(false)
      }
    }
    loadCrop()
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
