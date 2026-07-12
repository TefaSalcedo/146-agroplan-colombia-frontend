"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import {
  Sprout,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  CloudSun,
  Leaf,
  BarChart3,
  Maximize2,
  Minimize2,
  Trophy,
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
import { buildLocationPath } from "@/lib/routing"
import { GeoButton, MunicipalitySearchAutocomplete } from "@/components/location"
import { Municipality } from "@/types"

gsap.registerPlugin(useGSAP)

export function LandingPage() {
  const router = useRouter()
  const { selectedLocation, setSelectedLocation } = useLocation()
  const currentYear = new Date().getFullYear()

  // Refs for GSAP animation
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const centerTriggerRef = useRef<HTMLButtonElement>(null)
  const cropBodyRef = useRef<HTMLDivElement>(null)
  const locationBodyRef = useRef<HTMLDivElement>(null)
  const isExpandedRef = useRef(false)
  const isMouseInsideRef = useRef(false)
  const toggleCardsRef = useRef<(() => void) | undefined>(undefined)

  const [isExpanded, setIsExpanded] = useState(false)

  // Crop selection state
  const [selectedCrop, setSelectedCrop] = useState("")

  // Location selection state
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedMunic, setSelectedMunic] = useState("")
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null)
  const [isLoadingGeo, setIsLoadingGeo] = useState(false)
  const [isLoadingManual, setIsLoadingManual] = useState(false)
  const [showManualSelects, setShowManualSelects] = useState(false)
  const [nearbySuggestion, setNearbySuggestion] = useState<Municipality | null>(null)

  const { crops, loading: cropsLoading } = useCrops()
  const { departments, loading: departmentsLoading } = useDepartments()
  const { municipalities: deptMunicipios, loading: municipalitiesLoading } = useMunicipalities(selectedDept)

  // Pre-fill the location form when a location was previously selected
  // so the user sees their current department/municipio when returning home.
  useEffect(() => {
    if (!selectedLocation) return
    setSelectedDept(selectedLocation.department)
    setSelectedMunic(selectedLocation.id)
    setSelectedMunicipality(selectedLocation)
  }, [selectedLocation])

  const handleContinueWithCrop = () => {
    if (!selectedCrop) return
    router.push(`/mapa/${selectedCrop}`)
  }

  const handleUseCurrentLocation = async () => {
    setIsLoadingGeo(true)
    setNearbySuggestion(null)

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
          setSelectedMunicipality(nearbyMunicipality)
          setSelectedMunic(nearbyMunicipality.id)
          setSelectedDept(nearbyMunicipality.department)
          router.push(buildLocationPath(nearbyMunicipality.department, nearbyMunicipality.name, "inicio"))
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
    setNearbySuggestion(null)
    if (!municipality) {
      setSelectedMunic("")
      setSelectedMunicipality(null)
      return
    }
    setSelectedMunic(municipality.id)
    setSelectedDept(municipality.department)
    setSelectedMunicipality(municipality)
  }

  const handleRequestNearbyFromSearch = async () => {
    setIsLoadingGeo(true)
    try {
      if (!("geolocation" in navigator)) {
        alert("Tu navegador no soporta geolocalización.")
        return
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        })
      })

      const { latitude, longitude } = position.coords
      if (!isWithinColombia(latitude, longitude)) {
        alert("Tu ubicación parece estar fuera de Colombia.")
        return
      }

      const nearbyMunicipality = await fetchNearbyMunicipality(latitude, longitude, 20)
      setNearbySuggestion(nearbyMunicipality)
    } catch (error) {
      const message = error instanceof ApiError && error.status && [400, 404].includes(error.status)
        ? "No encontramos un municipio cercano cubierto por AgroPlan."
        : "No pudimos obtener tu ubicación."
      alert(message)
    } finally {
      setIsLoadingGeo(false)
    }
  }

  const handleAcceptNearbySuggestion = () => {
    if (!nearbySuggestion) return
    setSelectedMunicipality(nearbySuggestion)
    setSelectedMunic(nearbySuggestion.id)
    setSelectedDept(nearbySuggestion.department)
    setNearbySuggestion(null)
  }

  const handleContinueWithSelection = async () => {
    if (!selectedMunic) return
    setIsLoadingManual(true)
    try {
      const municipality = await fetchMunicipality(selectedMunic)
      setSelectedLocation(municipality)
      router.push(buildLocationPath(municipality.department, municipality.name, "inicio"))
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

  useGSAP(
    (context, contextSafe) => {
      if (!contextSafe) return

      gsap.set([cropBodyRef.current, locationBodyRef.current], {
        height: 0,
        opacity: 0,
      })

      let collapseTimer: ReturnType<typeof setTimeout> | null = null
      let selectObserver: MutationObserver | null = null

      const cancelCollapseTimer = () => {
        if (collapseTimer) {
          clearTimeout(collapseTimer)
          collapseTimer = null
        }
      }

      const hasOpenSelect = () => {
        return !!container?.querySelector('[aria-expanded="true"]')
      }

      const animateCollapse = contextSafe(() => {
        isExpandedRef.current = false
        setIsExpanded(false)

        gsap.to([cropBodyRef.current, locationBodyRef.current], {
          height: 0,
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
          stagger: 0.04,
        })
      })

      const maybeCollapseAfterSelectsClose = () => {
        if (isMouseInsideRef.current || hasOpenSelect()) return
        cancelCollapseTimer()
        collapseTimer = setTimeout(() => {
          if (isMouseInsideRef.current || hasOpenSelect()) return
          animateCollapse()
        }, 200)
      }

      const startSelectObserver = () => {
        if (selectObserver || !container) return
        selectObserver = new MutationObserver(() => {
          if (!hasOpenSelect()) {
            maybeCollapseAfterSelectsClose()
          }
        })
        selectObserver.observe(container, {
          attributes: true,
          subtree: true,
          attributeFilter: ["aria-expanded"],
        })
      }

      const stopSelectObserver = () => {
        selectObserver?.disconnect()
        selectObserver = null
      }

      const expandCards = contextSafe(() => {
        cancelCollapseTimer()
        stopSelectObserver()
        if (isExpandedRef.current) return
        isExpandedRef.current = true
        setIsExpanded(true)

        gsap.to([cropBodyRef.current, locationBodyRef.current], {
          height: "auto",
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
        })
      })

      const collapseCards = contextSafe(() => {
        if (!isExpandedRef.current) return
        cancelCollapseTimer()
        stopSelectObserver()

        if (hasOpenSelect()) {
          startSelectObserver()
          return
        }

        collapseTimer = setTimeout(() => {
          if (hasOpenSelect() || isMouseInsideRef.current) return
          animateCollapse()
        }, 200)
      })

      const toggleCards = contextSafe(() => {
        if (isExpandedRef.current) {
          cancelCollapseTimer()
          stopSelectObserver()
          animateCollapse()
        } else {
          expandCards()
        }
      })

      toggleCardsRef.current = toggleCards

      const container = cardsContainerRef.current
      const trigger = centerTriggerRef.current

      const handleMouseEnter = contextSafe(() => {
        isMouseInsideRef.current = true
        expandCards()
      })

      const handleMouseLeave = contextSafe(() => {
        isMouseInsideRef.current = false
        collapseCards()
      })

      const handleFocusIn = contextSafe(() => {
        expandCards()
      })

      const handleFocusOut = contextSafe((event: FocusEvent) => {
        const relatedTarget = event.relatedTarget as Node | null
        if (container && relatedTarget && container.contains(relatedTarget)) return
        collapseCards()
      })

      const cleanup = () => {
        cancelCollapseTimer()
        stopSelectObserver()
        container?.removeEventListener("mouseenter", handleMouseEnter)
        container?.removeEventListener("mouseleave", handleMouseLeave)
        container?.removeEventListener("focusin", handleFocusIn)
        container?.removeEventListener("focusout", handleFocusOut)
        trigger?.removeEventListener("touchstart", toggleCards)
      }

      if (container) {
        container.addEventListener("mouseenter", handleMouseEnter)
        container.addEventListener("mouseleave", handleMouseLeave)
        container.addEventListener("focusin", handleFocusIn)
        container.addEventListener("focusout", handleFocusOut)
      }

      if (trigger) {
        trigger.addEventListener("touchstart", toggleCards, { passive: true })
      }

      return cleanup
    },
    { scope: cardsContainerRef }
  )

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
        <div
          ref={cardsContainerRef}
          className="relative grid w-full max-w-4xl gap-6 lg:grid-cols-2"
        >
          {/* Crop Card */}
          <div className="h-full min-h-0">
            <Card className="flex h-full flex-col gap-5 overflow-hidden border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
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

              <div
                ref={cropBodyRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
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
                  className="mt-6 h-12 w-full gap-2 rounded-xl text-base font-semibold"
                >
                  <Leaf className="size-5" />
                  Ver recomendaciones
                </Button>
              </div>
            </Card>
          </div>

          {/* Central expand trigger */}
          <button
            ref={centerTriggerRef}
            type="button"
            aria-label={isExpanded ? "Colapsar tarjetas" : "Expandir tarjetas"}
            aria-expanded={isExpanded}
            onClick={() => toggleCardsRef.current?.()}
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-1 rounded-full border-2 border-white/40 bg-black/50 p-3 text-white shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:p-4"
          >
            {isExpanded ? (
              <Minimize2 className="size-5 sm:size-6" />
            ) : (
              <Maximize2 className="size-5 sm:size-6" />
            )}
            <span className="max-w-[4rem] text-center text-[10px] leading-tight font-medium sm:text-xs">
              {isExpanded ? "Cerrar" : "Abrir"}
            </span>
          </button>

          {/* Location Card */}
          <div className="h-full min-h-0">
            <Card className="flex h-full flex-col gap-5 overflow-hidden border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8">
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

              <div
                ref={locationBodyRef}
                className="overflow-hidden"
                style={{ height: 0, opacity: 0 }}
              >
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
                    <MunicipalitySearchAutocomplete
                      value={selectedMunic}
                      selectedMunicipality={selectedMunicipality ?? undefined}
                      onSelect={handleSelectMunicipalityFromSearch}
                      placeholder="Buscar municipio o departamento..."
                      noResultsHint={
                        <span className="flex flex-col gap-2 rounded-lg border border-dashed border-border bg-muted/50 p-3">
                          <span>No encontramos tu municipio.</span>
                          <button
                            type="button"
                            onClick={handleRequestNearbyFromSearch}
                            disabled={isLoadingGeo}
                            className="flex items-center gap-1.5 text-primary hover:underline disabled:pointer-events-none disabled:opacity-60"
                          >
                            <MapPin className="size-3.5" />
                            {isLoadingGeo ? "Buscando municipio más cercano..." : "Usar municipio más cercano a mi ubicación"}
                          </button>
                        </span>
                      }
                    />
                    {nearbySuggestion && (
                      <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm">
                        <p className="font-medium text-foreground">Municipio más cercano encontrado</p>
                        <p className="text-muted-foreground">
                          {nearbySuggestion.name}, {nearbySuggestion.department}
                        </p>
                        <button
                          type="button"
                          onClick={handleAcceptNearbySuggestion}
                          className="mt-2 text-xs font-semibold text-primary hover:underline"
                        >
                          Seleccionar este municipio
                        </button>
                      </div>
                    )}
                    {selectedMunicipality && !nearbySuggestion && (
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
                        Ocultar selecciones manuales
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
                  <Button
                    onClick={handleContinueWithSelection}
                    disabled={!selectedMunic || isLoadingManual}
                    size="lg"
                    className="mt-2 h-12 w-full gap-2 rounded-xl text-base font-semibold"
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
              </div>
            </Card>
          </div>
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
        <div className="mt-6 flex flex-col items-center gap-2 text-center text-xs text-white/70">
          <Link
            href="/concurso"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Trophy className="size-3" />
            <span>Datos al ecosistema 2026</span>
          </Link>
          <p>
            © {currentYear} AgroPlan Colombia · Inteligencia para el Campo
          </p>
        </div>
      </div>
    </div>
  )
}
