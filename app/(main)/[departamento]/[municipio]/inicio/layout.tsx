import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ departamento: string; municipio: string }>
}): Promise<Metadata> {
  const { departamento, municipio } = await params
  const locationPath = `/${departamento}/${municipio}/inicio`
  const municipalityName = decodeURIComponent(municipio).replace(/-/g, ' ')

  return {
    title: `Dashboard agrícola de ${municipalityName}`,
    description: `Consulta recomendaciones de cultivos, clima y datos regionales en tiempo real para ${municipalityName}.`,
    keywords: ['dashboard agrícola', 'recomendaciones de cultivos', 'inteligencia agrícola', `agricultura en ${municipalityName}`],
    alternates: { canonical: locationPath },
    openGraph: {
      title: `Dashboard agrícola de ${municipalityName} | AgroPlan Colombia`,
      description: `Recomendaciones agrícolas personalizadas para ${municipalityName}.`,
      type: 'website',
      url: locationPath,
    },
  }
}

export default function InicioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
