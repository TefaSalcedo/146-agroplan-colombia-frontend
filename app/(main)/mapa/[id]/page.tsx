import type { Metadata } from "next"
import { CropMapView } from "./CropMapView"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const cropName = decodeURIComponent(id).replace(/-/g, " ")

  return {
    title: `Mapa de ${cropName}`,
    description: `Explora el mapa agrícola y la distribución territorial de ${cropName} en Colombia con AgroPlan.`,
    keywords: [`mapa de ${cropName}`, "mapa agrícola Colombia", "inteligencia agrícola"],
    alternates: {
      canonical: `/mapa/${encodeURIComponent(id)}`,
    },
    openGraph: {
      title: `Mapa de ${cropName} | AgroPlan Colombia`,
      description: `Consulta la información geográfica de ${cropName} en Colombia.`,
      type: "website",
      url: `/mapa/${encodeURIComponent(id)}`,
    },
  }
}

export default async function CropMapPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CropMapView cropId={id} />
}
