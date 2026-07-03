import { fetchApi } from "./client"
import type { CropListResponse, CropLite } from "./types"
import type { Crop } from "@/types"

export async function fetchCrops(): Promise<Crop[]> {
  const response = await fetchApi<CropListResponse>("/crops")
  return response.crops
}

export async function fetchCrop(id: string): Promise<Crop> {
  return fetchApi<Crop>(`/crops/${id}`)
}

export async function fetchCropsLite(): Promise<CropLite[]> {
  return fetchApi<CropLite[]>("/crops/lite")
}

export const cropsApi = {
  list: fetchCrops,
  get: fetchCrop,
  lite: fetchCropsLite,
}
