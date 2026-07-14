import type { Metadata } from "next"
import { PresentationDeck } from "@/components/presentation-deck"

export const metadata: Metadata = {
  title: "AgroPlan Colombia | Presentación",
  description: "Pitch visual de AgroPlan Colombia.",
  robots: "noindex, nofollow",
  alternates: {
    canonical: '/presentacion',
  },
  openGraph: {
    title: 'AgroPlan Colombia | Presentación',
    description: 'Conoce la propuesta de inteligencia agrícola de AgroPlan Colombia.',
    type: 'website',
    url: '/presentacion',
  },
}

export default function PresentationPage() {
  return <PresentationDeck />
}
