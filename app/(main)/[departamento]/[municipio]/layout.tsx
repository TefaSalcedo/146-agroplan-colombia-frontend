import type { Metadata } from 'next'
import type { ReactNode } from 'react'

type LocationParams = {
  params: Promise<{ departamento: string; municipio: string }>
}

function displayName(value: string) {
  return decodeURIComponent(value).replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export async function generateMetadata({ params }: LocationParams): Promise<Metadata> {
  const { departamento, municipio } = await params
  const departmentName = displayName(departamento)
  const municipalityName = displayName(municipio)

  return {
    title: `${municipalityName}, ${departmentName}`,
    description: `Consulta recomendaciones de cultivos, clima, calendario agrícola y mapas para ${municipalityName}, ${departmentName}, con la inteligencia agrícola de AgroPlan Colombia.`,
    keywords: [
      `agricultura en ${municipalityName}`,
      `cultivos de ${departmentName}`,
      `calendario agrícola ${municipalityName}`,
      'recomendaciones agrícolas Colombia',
    ],
    alternates: {
      canonical: `/${encodeURIComponent(departamento)}/${encodeURIComponent(municipio)}`,
    },
    openGraph: {
      title: `${municipalityName}, ${departmentName} | AgroPlan Colombia`,
      description: `Recomendaciones agrícolas y datos agroclimáticos para ${municipalityName}, ${departmentName}.`,
      type: 'website',
      url: `/${encodeURIComponent(departamento)}/${encodeURIComponent(municipio)}`,
    },
  }
}

export default function MainLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
