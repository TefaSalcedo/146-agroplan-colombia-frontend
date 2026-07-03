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
  
  return response.municipalities
}

export async function fetchMunicipality(
  id: string
): Promise<Municipality> {
  return fetchApi<Municipality>(`/municipalities/${id}`)
}

export async function fetchDepartments(): Promise<string[]> {
  const response = await fetchApi<DepartmentsResponse>("/municipalities/departments")
  return response.departments
}

export async function fetchNearbyMunicipality(
  lat: number,
  lng: number
): Promise<Municipality> {
  const params = new URLSearchParams()
  params.append("lat", lat.toString())
  params.append("lng", lng.toString())
  
  return fetchApi<Municipality>(`/municipalities/nearby?${params.toString()}`)
}

export const municipalitiesApi = {
  list: fetchMunicipalities,
  get: fetchMunicipality,
  departments: fetchDepartments,
  nearby: fetchNearbyMunicipality,
}
