import { CropDetailView } from '@/components/crop-detail-view'
import { fetchCrop } from '@/lib/api-client/crops'

export default async function CropDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let initialCrop
  try {
    initialCrop = await fetchCrop(id)
  } catch {
    initialCrop = undefined
  }

  return <CropDetailView id={id} initialCrop={initialCrop} />
}
