import type { Crop, Municipality, ClimateAlert, Weather, Location } from "@/types"

export const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
]

export const MONTHS_LONG = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export const currentLocation: Location = {
  municipality: "Rionegro",
  department: "Antioquia",
  altitude: 2125,
}

export const currentWeather: Weather = {
  temperature: 19,
  condition: "Parcialmente nublado",
  humidity: 72,
  precipitation: 45,
  icon: "partly",
}

export const crops: Crop[] = [
  {
    id: "cafe",
    name: "Café",
    scientificName: "Coffea arabica",
    image: "/crops/cafe.png",
    successRate: 92,
    recommendation: "high",
    shortReason: "Clima y altitud ideales en tu zona.",
    reason:
      "Tu municipio tiene la altitud, la temperatura templada y las lluvias que el café necesita para crecer sano. El suelo de la región es fértil y bien drenado, condiciones perfectas para una buena cosecha.",
    daysToHarvest: 270,
    soilType: "Franco, fértil y bien drenado",
    idealTemperature: "18 – 24 °C",
    humidity: "70 – 80 %",
    precipitation: "1.500 – 2.500 mm / año",
    altitude: "1.200 – 2.000 msnm",
    irrigation: "Moderado, mantener humedad constante",
    substrates: ["Materia orgánica", "Compost", "Cascarilla de arroz"],
    plantingMonths: [2, 3, 9, 10],
    harvestMonths: [4, 5, 10, 11],
    stages: [
      { label: "Siembra", icon: "seed", description: "Se planta la semilla en almácigo." },
      { label: "Germinación", icon: "sprout", description: "Aparecen los primeros brotes." },
      { label: "Crecimiento", icon: "leaf", description: "La planta desarrolla ramas y hojas." },
      { label: "Floración", icon: "flower", description: "Aparecen las flores blancas." },
      { label: "Cosecha", icon: "harvest", description: "Se recogen los granos maduros." },
    ],
    tips: [
      { title: "Sombra parcial", description: "El café crece mejor con algo de sombra que lo proteja del sol fuerte." },
      { title: "Control de broca", description: "Revisa los granos con frecuencia para evitar la broca del café." },
      { title: "Abono orgánico", description: "Aplica compost cada 3 meses para mantener el suelo fértil." },
    ],
  },
  {
    id: "maiz",
    name: "Maíz",
    scientificName: "Zea mays",
    image: "/crops/maiz.png",
    successRate: 85,
    recommendation: "high",
    shortReason: "Buena temporada de lluvias para sembrar.",
    reason:
      "El maíz se adapta muy bien a tu región. La temporada de lluvias que viene favorece la germinación y el suelo tiene los nutrientes necesarios para un buen desarrollo de la planta.",
    daysToHarvest: 120,
    soilType: "Franco arcilloso, con buena materia orgánica",
    idealTemperature: "20 – 30 °C",
    humidity: "60 – 70 %",
    precipitation: "600 – 1.200 mm / ciclo",
    altitude: "0 – 2.800 msnm",
    irrigation: "Riego regular en épocas secas",
    substrates: ["Compost", "Estiércol curado", "Humus de lombriz"],
    plantingMonths: [3, 4, 8, 9],
    harvestMonths: [7, 8, 11, 12],
    stages: [
      { label: "Siembra", icon: "seed", description: "Se depositan las semillas en el surco." },
      { label: "Germinación", icon: "sprout", description: "Brotan las primeras plántulas." },
      { label: "Crecimiento", icon: "leaf", description: "El tallo crece y salen las hojas." },
      { label: "Floración", icon: "flower", description: "Aparece la espiga y los pelos." },
      { label: "Cosecha", icon: "harvest", description: "Las mazorcas están listas." },
    ],
    tips: [
      { title: "Distancia entre plantas", description: "Deja 25 cm entre plantas para que crezcan sin competir." },
      { title: "Riego en floración", description: "No dejes que le falte agua durante la floración." },
      { title: "Rotación de cultivos", description: "Alterna con fríjol para mejorar el suelo." },
    ],
  },
  {
    id: "frijol",
    name: "Fríjol",
    scientificName: "Phaseolus vulgaris",
    image: "/crops/frijol.png",
    successRate: 78,
    recommendation: "medium",
    shortReason: "Recomendado, vigila la humedad del suelo.",
    reason:
      "El fríjol es una buena opción para tu zona y además mejora la fertilidad del suelo. Ten en cuenta que necesita un buen drenaje para evitar enfermedades por exceso de humedad.",
    daysToHarvest: 90,
    soilType: "Franco, suelto y bien drenado",
    idealTemperature: "15 – 27 °C",
    humidity: "65 – 75 %",
    precipitation: "300 – 600 mm / ciclo",
    altitude: "1.000 – 2.400 msnm",
    irrigation: "Moderado, evitar encharcamientos",
    substrates: ["Humus de lombriz", "Compost", "Ceniza vegetal"],
    plantingMonths: [1, 2, 8, 9],
    harvestMonths: [4, 5, 11, 12],
    stages: [
      { label: "Siembra", icon: "seed", description: "Se siembra la semilla directamente." },
      { label: "Germinación", icon: "sprout", description: "Salen los cotiledones." },
      { label: "Crecimiento", icon: "leaf", description: "La planta se enreda y crece." },
      { label: "Floración", icon: "flower", description: "Aparecen flores y vainas." },
      { label: "Cosecha", icon: "harvest", description: "Se recogen las vainas secas." },
    ],
    tips: [
      { title: "Buen drenaje", description: "Evita el encharcamiento para prevenir hongos en la raíz." },
      { title: "Tutorado", description: "Si es fríjol de enredadera, usa varas para sostenerlo." },
      { title: "Cosecha a tiempo", description: "Recoge las vainas cuando estén secas pero antes de que se abran." },
    ],
  },
]

/** Extra crops for the "más cultivos para ti" section — lightweight cards only */
export const extraCrops = [
  {
    id: "tomate",
    name: "Tomate",
    image: "/crops/tomate.png",
    recommendation: "medium" as const,
    successRate: 74,
  },
  {
    id: "aguacate",
    name: "Aguacate",
    image: "/crops/aguacate.png",
    recommendation: "high" as const,
    successRate: 88,
  },
  {
    id: "platano",
    name: "Plátano",
    image: "/crops/platano.png",
    recommendation: "medium" as const,
    successRate: 69,
  },
  {
    id: "papa",
    name: "Papa",
    image: "/crops/papa.png",
    recommendation: "high" as const,
    successRate: 83,
  },
  {
    id: "cacao",
    name: "Cacao",
    image: "/crops/cacao.png",
    recommendation: "low" as const,
    successRate: 41,
  },
]

export function getCrop(id: string): Crop | undefined {
  return crops.find((c) => c.id === id)
}

export const municipalities: Municipality[] = [
  {
    id: "rionegro",
    name: "Rionegro",
    department: "Antioquia",
    lat: 6.155,
    lng: -75.374,
    altitude: 2125,
    avgTemperature: 17,
    precipitation: 1900,
    suitability: { cafe: "high", maiz: "high", frijol: "medium" },
  },
  {
    id: "la-union",
    name: "La Unión",
    department: "Antioquia",
    lat: 5.974,
    lng: -75.36,
    altitude: 2500,
    avgTemperature: 14,
    precipitation: 2100,
    suitability: { cafe: "medium", maiz: "low", frijol: "high" },
  },
  {
    id: "marinilla",
    name: "Marinilla",
    department: "Antioquia",
    lat: 6.174,
    lng: -75.338,
    altitude: 2120,
    avgTemperature: 17,
    precipitation: 1850,
    suitability: { cafe: "high", maiz: "medium", frijol: "high" },
  },
  {
    id: "medellin",
    name: "Medellín",
    department: "Antioquia",
    lat: 6.244,
    lng: -75.581,
    altitude: 1495,
    avgTemperature: 22,
    precipitation: 1650,
    suitability: { cafe: "medium", maiz: "high", frijol: "medium" },
  },
  {
    id: "el-carmen",
    name: "El Carmen de Viboral",
    department: "Antioquia",
    lat: 6.083,
    lng: -75.334,
    altitude: 2150,
    avgTemperature: 16,
    precipitation: 2000,
    suitability: { cafe: "high", maiz: "medium", frijol: "high" },
  },
  {
    id: "guarne",
    name: "Guarne",
    department: "Antioquia",
    lat: 6.279,
    lng: -75.442,
    altitude: 2150,
    avgTemperature: 16,
    precipitation: 1800,
    suitability: { cafe: "medium", maiz: "high", frijol: "medium" },
  },
  {
    id: "la-ceja",
    name: "La Ceja",
    department: "Antioquia",
    lat: 6.028,
    lng: -75.431,
    altitude: 2200,
    avgTemperature: 16,
    precipitation: 1950,
    suitability: { cafe: "medium", maiz: "low", frijol: "high" },
  },
  {
    id: "sonson",
    name: "Sonsón",
    department: "Antioquia",
    lat: 5.711,
    lng: -75.31,
    altitude: 2475,
    avgTemperature: 14,
    precipitation: 2300,
    suitability: { cafe: "low", maiz: "low", frijol: "medium" },
  },
]

export const climateAlerts: ClimateAlert[] = [
  {
    id: "1",
    level: "warning",
    title: "Lluvias fuertes esta semana",
    description: "Se esperan precipitaciones altas del jueves al domingo. Protege los semilleros.",
  },
  {
    id: "2",
    level: "info",
    title: "Temporada seca próxima",
    description: "En dos semanas inicia una temporada más seca. Buen momento para preparar el suelo.",
  },
]

export function getSuitabilityLabel(s: string): string {
  switch (s) {
    case "high":
      return "Aptitud alta"
    case "medium":
      return "Aptitud media"
    case "low":
      return "Aptitud baja"
    default:
      return "No apta"
  }
}

/** Hex colors for map + legend, tuned to be soft */
export const suitabilityColors: Record<string, string> = {
  high: "#4a9d5b",
  medium: "#e0b955",
  low: "#d98d54",
  none: "#b8b8b0",
}

export function getRecommendationLabel(r: string): string {
  switch (r) {
    case "high":
      return "Muy recomendado"
    case "medium":
      return "Recomendado"
    default:
      return "Poco recomendado"
  }
}

/** Deterministic pseudo-random calendar for a given month/crop/municipality */
export function generateCalendar(
  seed: number,
): { day: number; rating: "ideal" | "acceptable" | "notRecommended" }[] {
  const days: { day: number; rating: "ideal" | "acceptable" | "notRecommended" }[] = []
  for (let day = 1; day <= 30; day++) {
    const value = (Math.sin(seed * 12.9898 + day * 78.233) * 43758.5453) % 1
    const normalized = Math.abs(value)
    let rating: "ideal" | "acceptable" | "notRecommended"
    if (normalized > 0.6) rating = "ideal"
    else if (normalized > 0.3) rating = "acceptable"
    else rating = "notRecommended"
    days.push({ day, rating })
  }
  return days
}
