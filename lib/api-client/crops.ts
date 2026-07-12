import { fetchApi } from "./client"
import type { CropListResponse, CropLite, CropRecommendationResponse } from "./types"
import type { Crop } from "@/types"

function normalizeCropImage(image: string | undefined | null): string {
  if (!image) return "/placeholder.svg"
  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/")) {
    return image
  }
  if (image.startsWith("crops/")) {
    return `/${image}`
  }
  if (image.includes(".")) {
    return `/crops/${image}`
  }
  return `/crops/${image}.png`
}

function normalizeCrop(crop: Crop): Crop {
  return {
    ...crop,
    image: normalizeCropImage(crop.image),
  }
}

function normalizeCropLite(crop: CropLite): CropLite {
  return {
    ...crop,
    image: normalizeCropImage(crop.image),
  }
}

export async function fetchCrops(): Promise<Crop[]> {
  const response = await fetchApi<CropListResponse>("/crops")
  return response.crops.map(normalizeCrop)
}

export async function fetchCrop(id: string): Promise<Crop> {
  const crop = await fetchApi<Crop>(`/crops/${id}`)
  return normalizeCrop(crop)
}

export async function fetchCropsLite(): Promise<CropLite[]> {
  const crops = await fetchApi<CropLite[]>("/crops/lite")
  return crops.map(normalizeCropLite)
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
