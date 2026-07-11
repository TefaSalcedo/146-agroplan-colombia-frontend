import { fetchApi } from "./client"
import type { MunicipalityListResponse, DepartmentsResponse } from "./types"
import type { Municipality } from "@/types"

export async function fetchMunicipalities(
  department?: string
): Promise<Municipality[]> {
  const params = new URLSearchParams()
  if (department) {
    params.append("department", department)
  }
  
  const query = params.toString() ? `?${params.toString()}` : ""
  const response = await fetchApi<MunicipalityListResponse>(
    `/municipalities${query}`
  )

  return response.municipalities.map((m) => ({
    ...m,
    avgTemperature: m.avgTemperature ?? 0,
    precipitation: m.precipitation ?? 0,
    suitability: {},
  }))
}

export async function fetchMunicipality(
  id: string
): Promise<Municipality> {
  const municipality = await fetchApi<Municipality>(`/municipalities/${id}`)
  return {
    ...municipality,
    avgTemperature: municipality.avgTemperature ?? 0,
    precipitation: municipality.precipitation ?? 0,
    suitability: {},
  }
}

export async function fetchDepartments(): Promise<string[]> {
  const response = await fetchApi<DepartmentsResponse>("/municipalities/departments")
  return response.departments
}

export async function fetchNearbyMunicipality(
  lat: number,
  lng: number,
  maxDistanceKm = 20
): Promise<Municipality> {
  const params = new URLSearchParams()
  params.append("lat", lat.toString())
  params.append("lng", lng.toString())
  params.append("max_distance_km", maxDistanceKm.toString())

  const municipality = await fetchApi<Municipality>(`/municipalities/nearby?${params.toString()}`)
  return {
    ...municipality,
    avgTemperature: municipality.avgTemperature ?? 0,
    precipitation: municipality.precipitation ?? 0,
    suitability: {},
  }
}

export const municipalitiesApi = {
  list: fetchMunicipalities,
  get: fetchMunicipality,
  departments: fetchDepartments,
  nearby: fetchNearbyMunicipality,
}
