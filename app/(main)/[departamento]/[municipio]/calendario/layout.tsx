import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ departamento: string; municipio: string }>
}): Promise<Metadata> {
  const { departamento, municipio } = await params
  const locationPath = `/${departamento}/${municipio}/calendario`
  const municipalityName = decodeURIComponent(municipio).replace(/-/g, ' ')

  return {
    title: `Calendario agrícola de ${municipalityName}`,
    description: `Consulta el calendario de siembra y cosecha para ${municipalityName}, con planificación basada en datos agroclimáticos.`,
    keywords: ['calendario agrícola', 'siembra', 'cosecha', 'planificación de cultivos', `agricultura en ${municipalityName}`],
    alternates: { canonical: locationPath },
    openGraph: {
      title: `Calendario agrícola de ${municipalityName} | AgroPlan Colombia`,
      description: `Planifica siembras y cosechas en ${municipalityName}.`,
      type: 'website',
      url: locationPath,
    },
  }
}

export default function CalendarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
