import { MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { Location } from "@/types"

const RURAL_IMAGE = "/ai images/Image-rural.webp"
const URBAN_IMAGE = "/ai images/Image-urban.webp"

const urbanCities = new Set([
  "bogota",
  "medellin",
  "cali",
  "barranquilla",
  "cartagena",
  "bucaramanga",
  "santa marta",
  "pereira",
  "manizales",
  "cucuta",
  "ibague",
  "villavicencio",
  "monteria",
  "armenia",
  "neiva",
  "valledupar",
  "pasto",
  "sincelejo",
  "tunja",
  "popayan",
])

function normalizeCityName(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s*,\s*d\.?c\.?$/, "")
    .trim()
}

function isUrbanCity(municipality: string): boolean {
  return urbanCities.has(normalizeCityName(municipality))
}

function getLocationImage(location: Location): string {
  return isUrbanCity(location.municipality) ? URBAN_IMAGE : RURAL_IMAGE
}

interface LocationCardProps {
  location: Location
}

export function LocationCard({ location }: LocationCardProps) {
  const imageUrl = getLocationImage(location)

  return (
    <Card
      className="group relative flex h-full min-h-[9rem] flex-col justify-end overflow-hidden"
      style={{
        backgroundImage: `url(${encodeURI(imageUrl)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 transition-opacity group-hover:opacity-95" />

      <div className="relative flex flex-col gap-3 p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
            <MapPin className="size-7" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white/80">Estás en</p>
            <p className="truncate text-xl font-bold text-white">{location.municipality}</p>
            <p className="text-sm text-white/80">{location.department}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
