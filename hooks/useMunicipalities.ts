import { useState, useEffect } from "react"
import { fetchMunicipalities, fetchDepartments, fetchMunicipality } from "@/lib/api-client/municipalities"
import type { Municipality } from "@/types"
import { ApiError } from "@/lib/api-client/client"

export function useMunicipalities(department?: string) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMunicipalities = async (dept?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMunicipalities(dept)
      setMunicipalities(data)
    } catch (err) {
      setMunicipalities([])
      setError(err instanceof ApiError ? err.message : "Error loading municipalities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMunicipalities(department)
  }, [department])

  return { municipalities, loading, error, reload: loadMunicipalities }
}

export function useDepartments() {
  const [departments, setDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDepartments = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchDepartments()
        setDepartments(data)
      } catch (err) {
        setDepartments([])
        setError(err instanceof ApiError ? err.message : "Error loading departments")
      } finally {
        setLoading(false)
      }
    }
    loadDepartments()
  }, [])

  return { departments, loading, error }
}

export function useMunicipality(id: string) {
  const [municipality, setMunicipality] = useState<Municipality | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMunicipality = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const data = await fetchMunicipality(id)
        setMunicipality(data)
      } catch (err) {
        setMunicipality(null)
        setError(err instanceof ApiError ? err.message : "Error loading municipality")
      } finally {
        setLoading(false)
      }
    }
    loadMunicipality()
  }, [id])

  return { municipality, loading, error }
}
