import type { Metadata } from 'next'
import { CropDetailView } from '@/components/crop-detail-view'
import { fetchCrop } from '@/lib/api-client/crops'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ departamento: string; municipio: string; id: string }>
}): Promise<Metadata> {
  const { departamento, municipio, id } = await params
  const cropName = decodeURIComponent(id).replace(/-/g, ' ')
  const municipalityName = decodeURIComponent(municipio).replace(/-/g, ' ')
  const departmentName = decodeURIComponent(departamento).replace(/-/g, ' ')

  return {
    title: `${cropName} en ${municipalityName}`,
    description: `Consulta la ficha agrícola de ${cropName} para ${municipalityName}, ${departmentName}, con recomendaciones y datos de AgroPlan Colombia.`,
    keywords: [`${cropName} en ${municipalityName}`, `cultivos de ${departmentName}`, 'ficha de cultivo'],
    alternates: {
      canonical: `/${encodeURIComponent(departamento)}/${encodeURIComponent(municipio)}/cultivos/${encodeURIComponent(id)}`,
    },
    openGraph: {
      title: `${cropName} en ${municipalityName} | AgroPlan Colombia`,
      description: `Recomendaciones agrícolas para cultivar ${cropName} en ${municipalityName}.`,
      type: 'article',
    },
  }
}

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
