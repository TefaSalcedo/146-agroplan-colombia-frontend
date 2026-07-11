'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useDepartments, useMunicipalities } from '@/hooks'
import { fetchMunicipality, fetchNearbyMunicipality } from '@/lib/api-client/municipalities'
import { ApiError } from '@/lib/api-client/client'
import { useLocation } from '@/context/LocationContext'
import { isWithinColombia } from '@/lib/location-utils'
import Image from 'next/image'

export function LandingPage() {
  const router = useRouter()
  const { setSelectedLocation } = useLocation()
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMunic, setSelectedMunic] = useState('')
  const [isLoadingGeo, setIsLoadingGeo] = useState(false)
  const [isLoadingManual, setIsLoadingManual] = useState(false)
  const currentYear = new Date().getFullYear()
  
  const { departments, loading: departmentsLoading } = useDepartments()
  const { municipalities: municipalitiesData, loading: municipalitiesLoading } = useMunicipalities(selectedDept)

  const deptMunicipios = municipalitiesData

  const handleUseCurrentLocation = async () => {
    setIsLoadingGeo(true)
    
    if (!('geolocation' in navigator)) {
      alert('Tu navegador no soporta geolocalización. Por favor selecciona tu ubicación manualmente.')
      setIsLoadingGeo(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          if (!isWithinColombia(latitude, longitude)) {
            alert('Tu ubicación parece estar fuera de Colombia. Por favor selecciona tu ubicación manualmente.')
            return
          }
          
          const nearbyMunicipality = await fetchNearbyMunicipality(latitude, longitude, 20)
          setSelectedLocation(nearbyMunicipality)
          router.push('/inicio')
        } catch (error) {
          const message = error instanceof ApiError && error.status && [400, 404].includes(error.status)
            ? 'No encontramos un municipio cubierto por AgroPlan a menos de 20 km de tu ubicación. Por favor selecciona tu ubicación manualmente.'
            : 'No pudimos determinar tu ubicación. Por favor selecciona tu ubicación manualmente.'
          alert(message)
        } finally {
          setIsLoadingGeo(false)
        }
      },
      (error) => {
        console.error('Error de geolocalización:', error)
        let errorMessage = 'No pudimos obtener tu ubicación. '
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Por favor permite el acceso a tu ubicación en el navegador.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'La información de ubicación no está disponible.'
            break
          case error.TIMEOUT:
            errorMessage += 'La solicitud de ubicación ha expirado.'
            break
          default:
            errorMessage += 'Por favor selecciona tu ubicación manualmente.'
        }
        
        alert(errorMessage)
        setIsLoadingGeo(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  const handleContinueWithSelection = async () => {
    if (!selectedMunic) return
    setIsLoadingManual(true)
    try {
      const municipality = await fetchMunicipality(selectedMunic)
      setSelectedLocation(municipality)
      router.push('/inicio')
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 404
          ? 'No encontramos el municipio seleccionado en el backend. Intenta con otro municipio.'
          : 'No pudimos cargar el municipio seleccionado desde el backend. Inténtalo de nuevo.'
      alert(message)
    } finally {
      setIsLoadingManual(false)
    }
  }

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
      <div className="relative flex min-h-svh items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-6 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src="/logo.webp"
              alt="AgroPlan"
              width={80}
              height={80}
              className="rounded-2xl object-cover"
            />
          </div>

          {/* Heading */}
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Descubre qué sembrar en tu tierra</h1>
            <p className="text-sm text-muted-foreground">
              Planificación agrícola inteligente para un mejor campo colombiano
            </p>
          </div>

          {/* Geolocation Button */}
          <Button
            onClick={handleUseCurrentLocation}
            disabled={isLoadingGeo}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
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

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O SELECCIONA MANUALMENTE</span>
            </div>
          </div>

          {/* Manual Selection */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Departamento</label>
              <Select
                value={selectedDept}
                onValueChange={(dept) => {
                  setSelectedDept(dept)
                  setSelectedMunic('')
                }}
                disabled={departmentsLoading}
                items={Object.fromEntries(departments.map((d) => [d, d]))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      departmentsLoading ? 'Cargando departamentos...' : 'Selecciona un departamento'
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
                <div className="relative">
                  <Select
                    value={selectedMunic}
                    onValueChange={setSelectedMunic}
                    disabled={municipalitiesLoading || deptMunicipios.length === 0}
                    items={Object.fromEntries(deptMunicipios.map((m) => [m.id, m.name]))}
                  >
                    <SelectTrigger className="w-full pr-9">
                      <SelectValue
                        placeholder={
                          municipalitiesLoading
                            ? 'Cargando municipios...'
                            : deptMunicipios.length === 0
                              ? 'Sin municipios disponibles'
                              : 'Selecciona un municipio'
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
                  {municipalitiesLoading && (
                    <Loader2 className="pointer-events-none absolute right-8 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={handleContinueWithSelection}
              disabled={!selectedMunic || isLoadingManual}
              size="lg"
              variant="outline"
              className="w-full"
            >
              {isLoadingManual ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Validando municipio...
                </>
              ) : (
                'Continuar con selección'
              )}
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} AgroPlan Colombia · Inteligencia para el Campo
          </p>
        </Card>
      </div>
    </div>
  )
}
