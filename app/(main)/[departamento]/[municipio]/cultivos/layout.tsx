import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ departamento: string; municipio: string }>
}): Promise<Metadata> {
  const { departamento, municipio } = await params
  const locationPath = `/${departamento}/${municipio}/cultivos`
  const municipalityName = decodeURIComponent(municipio).replace(/-/g, ' ')

  return {
    title: `Cultivos recomendados para ${municipalityName}`,
    description: `Descubre qué cultivar en ${municipalityName} según el clima, el suelo y los datos agrícolas analizados por AgroPlan Colombia.`,
    keywords: ['cultivos recomendados', 'qué sembrar', 'recomendaciones agrícolas', `cultivos de ${municipalityName}`],
    alternates: { canonical: locationPath },
    openGraph: {
      title: `Cultivos recomendados para ${municipalityName} | AgroPlan Colombia`,
      description: `Recomendaciones de cultivos para ${municipalityName} basadas en datos agrícolas.`,
      type: 'website',
      url: locationPath,
    },
  }
}

export default function CultivosLayout({ children }: { children: React.ReactNode }) {
  return children
}
