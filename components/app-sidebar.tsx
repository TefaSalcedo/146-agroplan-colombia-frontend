"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useParams, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Cloud,
  Droplets,
  Home,
  Loader2,
  MapPin,
  Moon,
  Sprout,
  Sun,
  Thermometer,
  Trophy,
  CalendarDays,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/nav"
import { buildNavHref, buildLocationPath } from "@/lib/routing"
import { Button, buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocation } from "@/context/LocationContext"
import { useCropsLite, useCrop, useDepartments, useMunicipalities, useWeather } from "@/hooks"
import { concursoSections, getConcursoSection, type ConcursoSection } from "@/lib/concurso-sections"
import { ApiError } from "@/lib/api-client/client"
import { fetchMunicipality, fetchNearbyMunicipality } from "@/lib/api-client/municipalities"
import { isWithinColombia } from "@/lib/location-utils"

function formatMetric(value: number | null | undefined, suffix: string) {
  if (value == null || Number.isNaN(value)) {
    return "--"
  }

  return `${Math.round(value)}${suffix}`
}

interface LocationPanelContentProps {
  handleUseCurrentLocation: () => Promise<void>
  isLoadingGeo: boolean
  selectedDept: string
  setSelectedDept: (dept: string) => void
  selectedMunic: string
  setSelectedMunic: (munic: string) => void
  departments: string[]
  departmentsLoading: boolean
  municipalities: Array<{ id: string; name: string }>
  municipalitiesLoading: boolean
  handleContinueWithSelection: () => Promise<void>
  isLoadingManual: boolean
  isOpen: boolean
  onToggle: () => void
}

function LocationPanelContent({
  handleUseCurrentLocation,
  isLoadingGeo,
  selectedDept,
  setSelectedDept,
  selectedMunic,
  setSelectedMunic,
  departments,
  departmentsLoading,
  municipalities,
  municipalitiesLoading,
  handleContinueWithSelection,
  isLoadingManual,
  isOpen,
  onToggle,
}: LocationPanelContentProps) {
  return (
    <>
      <div className="relative">
        <button
          onClick={onToggle}
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full bg-primary hover:bg-primary/90"
          )}
        >
          {isOpen ? "Ocultar ubicación" : "Cambiar ubicación"}
        </button>
        <button
          onClick={onToggle}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 flex size-8 items-center justify-center rounded-lg transition-transform duration-300 hover:bg-primary/80",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          {isOpen ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
        </button>
      </div>
      <Collapsible.Panel className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-300 ease-out data-starting-style:h-0 data-ending-style:h-0 [&[hidden]:not([hidden='until-found'])]:hidden">
        <div className="pt-4">
          <Button
            onClick={handleUseCurrentLocation}
            disabled={isLoadingGeo}
            className="mb-4 w-full bg-primary hover:bg-primary/90"
          >
            {isLoadingGeo ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Localizando...
              </>
            ) : (
              <>
                <MapPin className="size-4" />
                Usar mi ubicación actual
              </>
            )}
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-sidebar px-2 text-muted-foreground">O selecciona manualmente</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-sidebar-foreground">Departamento</label>
              <Select
                value={selectedDept}
                onValueChange={(dept) => {
                  setSelectedDept(dept)
                  setSelectedMunic("")
                }}
                disabled={departmentsLoading}
                items={Object.fromEntries(departments.map((department) => [department, department]))}
              >
                <SelectTrigger className="w-full bg-background/70">
                  <SelectValue
                    placeholder={
                      departmentsLoading ? "Cargando departamentos..." : "Selecciona un departamento"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDept && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-sidebar-foreground">Municipio</label>
                <div className="relative">
                  <Select
                    value={selectedMunic}
                    onValueChange={setSelectedMunic}
                    disabled={municipalitiesLoading || municipalities.length === 0}
                    items={Object.fromEntries(municipalities.map((municipality) => [municipality.id, municipality.name]))}
                  >
                    <SelectTrigger className="w-full bg-background/70 pr-9">
                      <SelectValue
                        placeholder={
                          municipalitiesLoading
                            ? "Cargando municipios..."
                            : municipalities.length === 0
                              ? "Sin municipios disponibles"
                              : "Selecciona un municipio"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {municipalities.map((municipality) => (
                        <SelectItem key={municipality.id} value={municipality.id}>
                          {municipality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {municipalitiesLoading && (
                    <Loader2 className="pointer-events-none absolute right-8 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={handleContinueWithSelection}
              disabled={!selectedMunic || isLoadingManual}
              variant="outline"
              className="w-full"
            >
              {isLoadingManual ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Validando municipio...
                </>
              ) : (
                "Aplicar ubicación"
              )}
            </Button>
          </div>
        </div>
      </Collapsible.Panel>
    </>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { selectedLocation, setSelectedLocation } = useLocation()
  const [mounted, setMounted] = useState(false)
  const [selectedDept, setSelectedDept] = useState("")
  const [selectedMunic, setSelectedMunic] = useState("")
  const [isLoadingGeo, setIsLoadingGeo] = useState(false)
  const [isLoadingManual, setIsLoadingManual] = useState(false)
  const [isLocationPanelOpen, setIsLocationPanelOpen] = useState(false)
  const searchParams = useSearchParams()
  const params = useParams<{ id?: string }>()
  const { crop: mapaCrop } = useCrop(params.id ?? "")

  const { departments, loading: departmentsLoading } = useDepartments()
  const { municipalities, loading: municipalitiesLoading } = useMunicipalities(selectedDept)
  const { crops: catalogCrops } = useCropsLite()
  const { weather } = useWeather(selectedLocation?.id ?? "")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!selectedLocation) return

    setSelectedDept(selectedLocation.department)
    setSelectedMunic(selectedLocation.id)
  }, [selectedLocation])

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
            return
          }

          const nearbyMunicipality = await fetchNearbyMunicipality(latitude, longitude, 20)
          setSelectedLocation(nearbyMunicipality)
        } catch (error) {
          const message =
            error instanceof ApiError && error.status && [400, 404].includes(error.status)
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

  const handleContinueWithSelection = async () => {
    if (!selectedMunic) return

    setIsLoadingManual(true)

    try {
      const municipality = await fetchMunicipality(selectedMunic)
      setSelectedLocation(municipality)
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

  if (!mounted) return null

  const isDark = theme === "dark"
  const isCompetitionRoute = pathname.startsWith("/concurso")
  const isMapaRoute = pathname.startsWith("/mapa")
  const isMunicipioRoute = !isCompetitionRoute && !isMapaRoute
  const activeConcursoSection = getConcursoSection(searchParams.get("section"))
  const firstCrop = catalogCrops[0]
  const concursoMapaHref = firstCrop ? `/mapa/${encodeURIComponent(firstCrop.id)}` : null
  const configHref = "/configuracion"

  return (
    <aside className="sticky top-0 hidden h-svh shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar self-start md:flex md:w-80">
      <div className="flex items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3 transition-transform duration-200 hover:scale-105">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary">
            <Image src="/logo.webp" alt="AgroPlan" width={40} height={40} className="size-10 rounded-2xl object-cover" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sidebar-foreground">AgroPlan</p>
            <p className="text-xs text-muted-foreground">Colombia</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          aria-pressed={isDark}
          className="flex size-9 items-center justify-center rounded-xl text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-2" aria-label="Navegación principal">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95 text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
        >
          <ArrowLeft className="size-5 shrink-0 transition-transform duration-200" />
          Volver al home
        </Link>

        {isCompetitionRoute && (
          <>
            {concursoSections.map((section) => {
              const Icon = section.icon
              const active = activeConcursoSection === section.id
              return (
                <Link
                  key={section.id}
                  href={`/concurso?section=${section.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95",
                    active
                      ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0", active && "scale-110")} />
                  {section.label}
                </Link>
              )
            })}
            <Link
              href={concursoMapaHref ?? "/"}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95",
                !concursoMapaHref && "pointer-events-none opacity-50",
                "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
              )}
            >
              <Sprout className="size-5 shrink-0" />
              Mapa
            </Link>
            {configHref ? (
              <Link
                href={configHref}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95 text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
              >
                <Settings className="size-5 shrink-0" />
                Configuración
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground">
                <Settings className="size-5 shrink-0" />
                Configuración
              </div>
            )}
          </>
        )}

        {isMapaRoute && (
          <>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sprout className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {mapaCrop ? mapaCrop.name : params.id ? "Cargando cultivo..." : "Cultivo"}
                </p>
                {mapaCrop && <p className="truncate text-xs text-muted-foreground">{mapaCrop.scientificName}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={() => document.getElementById("crop-calendar-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95 text-left text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
            >
              <CalendarDays className="size-5 shrink-0" />
              Información del cultivo calendario
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("crop-temperature-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95 text-left text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
            >
              <Thermometer className="size-5 shrink-0" />
              Información del cultivo temperatura
            </button>
            <Link
              href="/concurso"
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              <Trophy className="size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block">Datos al ecosistema 2026</span>
                <span className="block truncate text-xs text-white/80">Concurso Datos Abiertos</span>
              </div>
            </Link>
            {configHref ? (
              <Link
                href={configHref}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95 text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
              >
                <Settings className="size-5 shrink-0" />
                Configuración
              </Link>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground">
                <Settings className="size-5 shrink-0" />
                Configuración
              </div>
            )}
          </>
        )}

        {isMunicipioRoute && (
          <>
            {navItems.map((item) => {
              const segment = item.href.replace(/^\//, "")
              const href = buildNavHref(selectedLocation, segment)
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 active:scale-95",
                    active
                      ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:translate-x-1"
                  )}
                >
                  <Icon className={cn("size-5 shrink-0 transition-transform duration-200", active && "scale-110")} />
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/concurso"
              className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-sm font-medium text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95"
            >
              <Trophy className="size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block">Datos al ecosistema 2026</span>
                <span className="block truncate text-xs text-white/80">Concurso Datos Abiertos</span>
              </div>
            </Link>
          </>
        )}
      </nav>

      <div className="flex-1" />

      {isMunicipioRoute && (
        <div className="px-3 pb-4">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ubicación</p>
          <div className="rounded-3xl border border-border bg-sidebar-accent/30 p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Ubicación actual</p>
                <p className="truncate font-semibold text-sidebar-foreground">
                  {selectedLocation?.name ?? "Selecciona tu municipio"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {selectedLocation?.department ?? "Usa tu ubicación o el selector manual"}
                </p>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-2.5">
                <div className="mb-1 flex items-center gap-1 text-primary">
                  <Thermometer className="size-3.5" />
                  <span className="text-[11px] font-medium">Temp.</span>
                </div>
                <p className="text-sm font-semibold">
                  {formatMetric(weather?.temperature, "°C")}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-2.5">
                <div className="mb-1 flex items-center gap-1 text-primary">
                  <Droplets className="size-3.5" />
                  <span className="text-[11px] font-medium">Lluvia</span>
                </div>
                <p className="text-sm font-semibold">
                  {formatMetric(weather?.precipitation, "mm")}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/70 p-2.5">
                <div className="mb-1 flex items-center gap-1 text-primary">
                  <Cloud className="size-3.5" />
                  <span className="text-[11px] font-medium">Humedad</span>
                </div>
                <p className="text-sm font-semibold">
                  {formatMetric(weather?.humidity, "%")}
                </p>
              </div>
            </div>

            <Collapsible.Root open={isLocationPanelOpen} onOpenChange={setIsLocationPanelOpen}>
              <LocationPanelContent
                handleUseCurrentLocation={handleUseCurrentLocation}
                isLoadingGeo={isLoadingGeo}
                selectedDept={selectedDept}
                setSelectedDept={setSelectedDept}
                selectedMunic={selectedMunic}
                setSelectedMunic={setSelectedMunic}
                departments={departments}
                departmentsLoading={departmentsLoading}
                municipalities={municipalities}
                municipalitiesLoading={municipalitiesLoading}
                handleContinueWithSelection={handleContinueWithSelection}
                isLoadingManual={isLoadingManual}
                isOpen={isLocationPanelOpen}
                onToggle={() => setIsLocationPanelOpen(!isLocationPanelOpen)}
              />
            </Collapsible.Root>
          </div>
        </div>
      )}
    </aside>
  )
}
