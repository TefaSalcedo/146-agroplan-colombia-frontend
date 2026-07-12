import { fetchApi } from "./client"
import type { MunicipalityListResponse, DepartmentsResponse, MunicipalityDTO, MunicipalitySearchResponse, MunicipalitySearchResult } from "./types"
import type { Municipality } from "@/types"

function toMunicipality(m: MunicipalityDTO): Municipality {
  return {
    ...m,
    avgTemperature: m.avgTemperature ?? 0,
    precipitation: m.precipitation ?? 0,
    suitability: {},
  }
}

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

  return response.municipalities.map(toMunicipality)
}

export async function fetchMunicipality(
  id: string
): Promise<Municipality> {
  const municipality = await fetchApi<MunicipalityDTO>(`/municipalities/${id}`)
  return toMunicipality(municipality)
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

  const municipality = await fetchApi<MunicipalityDTO>(`/municipalities/nearby?${params.toString()}`)
  return toMunicipality(municipality)
}

export async function searchMunicipalities(
  query: string,
  limit = 20
): Promise<MunicipalitySearchResult[]> {
  const params = new URLSearchParams()
  params.append("q", query)
  params.append("limit", limit.toString())

  const response = await fetchApi<MunicipalitySearchResponse>(
    `/municipalities/search?${params.toString()}`
  )
  return response.results
}

export const municipalitiesApi = {
  list: fetchMunicipalities,
  get: fetchMunicipality,
  departments: fetchDepartments,
  nearby: fetchNearbyMunicipality,
  search: searchMunicipalities,
}
