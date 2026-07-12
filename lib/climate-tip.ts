import type { Weather } from "@/types"

export function getClimateTip(weather: Weather | null): string {
  return getClimateTips(weather)[0]
}

export function getClimateTips(weather: Weather | null): string[] {
  const tips: string[] = []

  if (weather) {
    if (weather.icon === "rain") {
      tips.push(
        "Se esperan lluvias. Revisa los drenajes y evita aplicar productos que se puedan lavar.",
      )
    } else if (weather.icon === "sun") {
      tips.push(
        "Día soleado. Aprovecha para labores de campo, pero protege las plantas del sol del mediodía.",
      )
    } else if (weather.icon === "partly") {
      tips.push(
        "El clima está parcialmente nublado. Es un buen momento para siembras o transplantes.",
      )
    } else if (weather.icon === "cloud") {
      tips.push(
        "Cielo nublado. Aprovecha para preparar el suelo o realizar podas livianas.",
      )
    }
  }

  tips.push(
    "Revisa el pronóstico antes de salir al campo. Un buen clima mejora el resultado de tus labores.",
    "Mantén el suelo húmedo y protegido. Evita la exposición directa en las horas de más sol.",
    "Observa tus cultivos regularmente. Detectar problemas a tiempo evita pérdidas mayores.",
  )

  return tips
}
