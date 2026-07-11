import { CropDetailView } from "./CropDetailView"

export default async function CropDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CropDetailView id={id} />
}
