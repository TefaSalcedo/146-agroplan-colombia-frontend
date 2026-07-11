"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Sprout,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  CloudSun,
  Leaf,
  BarChart3,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useCrops, useDepartments, useMunicipalities } from "@/hooks"
import { fetchMunicipality, fetchNearbyMunicipality } from "@/lib/api-client/municipalities"
import { ApiError } from "@/lib/api-client/client"
import { useLocation } from "@/context/LocationContext"
import { isWithinColombia } from "@/lib/location-utils"
import { GeoButton, MunicipalityAutocomplete, MapModal } from "@/components/location"
import { Municipality } from "@/types"

export function LandingPage() {
  const router = useRouter()
  const { setSelectedLocation } = useLocation()
  const currentYear = new Date().getFullYear()

  // Crop selection state
  const [selectedCrop, setSelectedCrop] = useState("")

  // Location selection state
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedMunic, setSelectedMunic] = useState("")
  const [isLoadingGeo, setIsLoadingGeo] = useState(false)
  const [isLoadingManual, setIsLoadingManual] = useState(false)
  const [showManualSelects, setShowManualSelects] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [selectedMapMunicipality, setSelectedMapMunicipality] = useState<Municipality | null>(null)

  const { crops, loading: cropsLoading } = useCrops()
  const { departments, loading: departmentsLoading } = useDepartments()
  const { municipalities: deptMunicipios, loading: municipalitiesLoading } = useMunicipalities(selectedDept)
  const { municipalities: allMunicipalities, loading: allMunicipalitiesLoading } = useMunicipalities()

  const handleContinueWithCrop = () => {
    if (!selectedCrop) return
    router.push(`/mapa/${selectedCrop}`)
  }

  const handleUseCurrentLocation = async () => {
    setIsLoadingGeo(true)

    if (!("geolocation" in navigator)) {
      alert("Tu navegador no soporta geolocalización. Por favor selecciona tu ubicación manualmente.")
      setIsLoadingGeo(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          if (!isWithinColombia(latitude, longitude)) {
            alert("Tu ubicación parece estar fuera de Colombia. Por favor selecciona tu ubicación manualmente.")
            setIsLoadingGeo(false)
            return
          }

          const nearbyMunicipality = await fetchNearbyMunicipality(latitude, longitude, 20)
          setSelectedLocation(nearbyMunicipality)
          router.push("/inicio")
        } catch (error) {
          const message = error instanceof ApiError && error.status && [400, 404].includes(error.status)
            ? "No encontramos un municipio cubierto por AgroPlan a menos de 20 km de tu ubicación. Por favor selecciona tu ubicación manualmente."
            : "No pudimos determinar tu ubicación. Por favor selecciona tu ubicación manualmente."
          alert(message)
        } finally {
          setIsLoadingGeo(false)
        }
      },
      (error) => {
        console.error("Error de geolocalización:", error)
        let errorMessage = "No pudimos obtener tu ubicación. "

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Por favor permite el acceso a tu ubicación en el navegador."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "La información de ubicación no está disponible."
            break
          case error.TIMEOUT:
            errorMessage += "La solicitud de ubicación ha expirado."
            break
          default:
            errorMessage += "Por favor selecciona tu ubicación manualmente."
        }

        alert(errorMessage)
        setIsLoadingGeo(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  const handleSelectMunicipalityFromSearch = (municipality: Municipality | null) => {
    if (!municipality) {
      setSelectedMunic("")
      return
    }
    setSelectedMunic(municipality.id)
    setSelectedDept(municipality.department)
  }

  const handleConfirmMapSelection = () => {
    if (selectedMapMunicipality) {
      setSelectedMunic(selectedMapMunicipality.id)
      setSelectedDept(selectedMapMunicipality.department)
    }
  }

  const handleContinueWithSelection = async () => {
    if (!selectedMunic) return
    setIsLoadingManual(true)
    try {
      const municipality = await fetchMunicipality(selectedMunic)
      setSelectedLocation(municipality)
      router.push("/inicio")
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 404
          ? "No encontramos el municipio seleccionado en el backend. Intenta con otro municipio."
          : "No pudimos cargar el municipio seleccionado desde el backend. Inténtalo de nuevo."
      alert(message)
    } finally {
      setIsLoadingManual(false)
    }
  }

  const selectedMunicipality = allMunicipalities.find((m) => m.id === selectedMunic) ?? null

  return (
    <div className="relative min-h-svh w-full overflow-hidden bg-black">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

      {/* Content */}
      <div className="relative flex min-h-svh flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Planifica mejor. Cosecha más.
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-white/90 sm:text-base">
            Te ayudamos a decidir qué sembrar según tu cultivo o tu ubicación.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid w-full max-w-4xl gap-6 lg:grid-cols-2">
          {/* Crop Card */}
          <Card className="flex flex-col gap-5 border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Sprout className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Por cultivo</h2>
                <p className="text-sm text-muted-foreground">
                  Elige tu cultivo y descubre el mejor momento y lugar para sembrar.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">
                1. ¿Qué quieres sembrar?
              </label>
              <p className="text-xs text-muted-foreground">Elige uno de estos cultivos</p>
              <Select
                value={selectedCrop}
                onValueChange={setSelectedCrop}
                disabled={cropsLoading}
                items={Object.fromEntries(crops.map((c) => [c.id, c.name]))}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue
                    placeholder={
                      cropsLoading ? "Cargando cultivos..." : "Selecciona un cultivo"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {crops.map((crop) => (
                    <SelectItem key={crop.id} value={crop.id}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleContinueWithCrop}
              disabled={!selectedCrop}
              size="lg"
              className="mt-auto h-12 w-full gap-2 rounded-xl text-base font-semibold"
            >
              <Leaf className="size-5" />
              Ver recomendaciones
            </Button>
          </Card>

          {/* Location Card */}
          <Card className="flex flex-col gap-5 border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <MapPin className="size-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Por ubicación</h2>
                <p className="text-sm text-muted-foreground">
                  Usa tu ubicación actual o busca tu lugar en el mapa.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <GeoButton
                isLoading={isLoadingGeo}
                onClick={handleUseCurrentLocation}
              />

              {/* Divider */}
              <div className="relative flex items-center py-1">
                <div className="grow border-t border-border" />
                <span className="mx-3 shrink-0 text-xs text-muted-foreground">
                  o buscar manualmente
                </span>
                <div className="grow border-t border-border" />
              </div>

              {/* Autocomplete */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Search className="size-4 text-muted-foreground" />
                  Buscar municipio
                </label>
                <MunicipalityAutocomplete
                  municipalities={allMunicipalities}
                  value={selectedMunic}
                  onSelect={handleSelectMunicipalityFromSearch}
                  loading={allMunicipalitiesLoading}
                  placeholder="Buscar municipio o vereda..."
                />
                {selectedMunicipality && (
                  <p className="text-xs text-primary">
                    {selectedMunicipality.name}, {selectedMunicipality.department}
                  </p>
                )}
              </div>

              {/* Optional manual selects */}
              <button
                type="button"
                onClick={() => setShowManualSelects((prev) => !prev)}
                className="flex w-full items-center justify-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {showManualSelects ? (
                  <>
                    Ocultar selects manuales
                    <ChevronUp className="size-3.5" />
                  </>
                ) : (
                  <>
                    Seleccionar con departamento y municipio
                    <ChevronDown className="size-3.5" />
                  </>
                )}
              </button>

              {showManualSelects && (
                <div className="space-y-3 rounded-xl border border-border bg-muted/50 p-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-foreground">Departamento</label>
                    <Select
                      value={selectedDept}
                      onValueChange={(dept) => {
                        setSelectedDept(dept)
                        setSelectedMunic("")
                      }}
                      disabled={departmentsLoading}
                      items={Object.fromEntries(departments.map((d) => [d, d]))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            departmentsLoading ? "Cargando departamentos..." : "Selecciona un departamento"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedDept && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-foreground">Municipio</label>
                      <Select
                        value={selectedMunic}
                        onValueChange={setSelectedMunic}
                        disabled={municipalitiesLoading || deptMunicipios.length === 0}
                        items={Object.fromEntries(deptMunicipios.map((m) => [m.id, m.name]))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              municipalitiesLoading
                                ? "Cargando municipios..."
                                : deptMunicipios.length === 0
                                  ? "Sin municipios disponibles"
                                  : "Selecciona un municipio"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {deptMunicipios.map((munic) => (
                            <SelectItem key={munic.id} value={munic.id}>
                              {munic.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {/* Map trigger */}
              <button
                type="button"
                onClick={() => setMapOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <MapPin className="size-4" />
                Elegir en el mapa
              </button>

              <MapModal
                municipalities={allMunicipalities}
                selected={selectedMapMunicipality}
                onSelect={setSelectedMapMunicipality}
                onConfirm={handleConfirmMapSelection}
                open={mapOpen}
                onOpenChange={setMapOpen}
              />

              <Button
                onClick={handleContinueWithSelection}
                disabled={!selectedMunic || isLoadingManual}
                size="lg"
                className="h-12 w-full gap-2 rounded-xl text-base font-semibold"
              >
                {isLoadingManual ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Validando municipio...
                  </>
                ) : (
                  <>
                    <MapPin className="size-5" />
                    Ver recomendaciones
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Benefits */}
        <div className="mt-8 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-4 text-white backdrop-blur-sm">
            <CloudSun className="mt-0.5 size-5 shrink-0 text-yellow-300" />
            <div>
              <p className="text-sm font-semibold">Información del clima</p>
              <p className="text-xs text-white/80">Datos en tiempo real para mejores decisiones.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-4 text-white backdrop-blur-sm">
            <Leaf className="mt-0.5 size-5 shrink-0 text-green-300" />
            <div>
              <p className="text-sm font-semibold">Recomendaciones simples</p>
              <p className="text-xs text-white/80">Consejos claros y fáciles de entender.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 p-4 text-white backdrop-blur-sm">
            <BarChart3 className="mt-0.5 size-5 shrink-0 text-blue-300" />
            <div>
              <p className="text-sm font-semibold">Datos confiables</p>
              <p className="text-xs text-white/80">Información oficial y actualizada para el campo colombiano.</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-center text-xs text-white/70">
          © {currentYear} AgroPlan Colombia · Inteligencia para el Campo
        </p>
      </div>
    </div>
  )
}
