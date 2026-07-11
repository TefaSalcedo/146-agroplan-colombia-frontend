import { CropMapView } from "./CropMapView"

export default async function CropMapPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CropMapView cropId={id} />
}
