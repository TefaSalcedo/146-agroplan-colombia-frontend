import type { Metadata } from "next"
import { PresentationDeck } from "@/components/presentation-deck"

export const metadata: Metadata = {
  title: "AgroPlan Colombia | Presentación",
  description: "Pitch visual de AgroPlan Colombia.",
  robots: "noindex, nofollow",
}

export default function PresentationPage() {
  return <PresentationDeck />
}
