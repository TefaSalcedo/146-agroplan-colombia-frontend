'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { municipalities } from '@/lib/mock-data'
import Image from 'next/image'

// Simple session-based location selection
function setSelectedLocation(municipioId: string) {
  const municipio = municipalities.find((m) => m.id === municipioId)
  if (municipio) {
    sessionStorage.setItem('selectedLocation', JSON.stringify(municipio))
  }
}

export function LandingPage() {
  const router = useRouter()
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMunic, setSelectedMunic] = useState('')
  const [isLoadingGeo, setIsLoadingGeo] = useState(false)

  const departments = Array.from(new Set(municipalities.map((m) => m.department))).sort()
  const deptMunicipios = selectedDept
    ? municipalities.filter((m) => m.department === selectedDept).sort((a, b) => a.name.localeCompare(b.name))
    : []

  const handleUseCurrentLocation = () => {
    setIsLoadingGeo(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Default to first municipality in Cauca
          const defaultMunic = municipalities.find((m) => m.department === 'Cauca')
          if (defaultMunic) {
            setSelectedLocation(defaultMunic.id)
            router.push('/inicio')
          }
          setIsLoadingGeo(false)
        },
        () => {
          setIsLoadingGeo(false)
        }
      )
    }
  }

  const handleContinueWithSelection = () => {
    if (!selectedMunic) return
    setSelectedLocation(selectedMunic)
    router.push('/inicio')
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
        <source src="/video/Drone_shot_Colombian_agricultura…_202605221851 (1).mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

      {/* Content */}
      <div className="relative flex min-h-svh items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-6 p-8">
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
            <div>
              <label className="text-xs font-medium text-foreground">Departamento</label>
            <Select
              value={selectedDept}
              onValueChange={(dept) => {
                setSelectedDept(dept)
                setSelectedMunic('')
              }}
              items={Object.fromEntries(departments.map((d) => [d, d]))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un departamento" />
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
              <div>
                <label className="text-xs font-medium text-foreground">Municipio</label>
                <Select
                  value={selectedMunic}
                  onValueChange={setSelectedMunic}
                  items={Object.fromEntries(deptMunicipios.map((m) => [m.id, m.name]))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un municipio" />
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

            <Button
              onClick={handleContinueWithSelection}
              disabled={!selectedMunic}
              size="lg"
              variant="outline"
              className="w-full"
            >
              Continuar con selección
            </Button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            © 2024 AgroPlan Colombia · Inteligencia para el Campo
          </p>
        </Card>
      </div>
    </div>
  )
}
