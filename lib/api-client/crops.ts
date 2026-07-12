import { fetchApi } from "./client"
import type { CropListResponse, CropLite, CropRecommendationResponse } from "./types"
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

export async function fetchCropRecommendations(
  cropId: string,
  municipalityId: string
): Promise<CropRecommendationResponse> {
  return fetchApi<CropRecommendationResponse>(
    `/crops/${cropId}/recommendations/${municipalityId}`
  )
}

export const cropsApi = {
  list: fetchCrops,
  get: fetchCrop,
  lite: fetchCropsLite,
  recommendations: fetchCropRecommendations,
}
