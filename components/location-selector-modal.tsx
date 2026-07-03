'use client'

import { useState, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useMunicipalities, useDepartments } from '@/hooks'
import type { Municipality } from '@/types'

interface LocationSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationSelectorModal({ isOpen, onClose }: LocationSelectorModalProps) {
  const { departments, loading: deptsLoading } = useDepartments()
  const { municipalities, loading: municsLoading, reload } = useMunicipalities()
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMunic, setSelectedMunic] = useState('')
  const [currentLocation, setCurrentLocation] = useState<string>('')
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<Municipality[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('selectedLocation')
      if (stored) {
        const location = JSON.parse(stored)
        setCurrentLocation(`${location.name}, ${location.department}`)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedDept && municipalities.length > 0) {
      const filtered = municipalities
        .filter((m) => m.department === selectedDept)
        .sort((a, b) => a.name.localeCompare(b.name))
      setFilteredMunicipalities(filtered)
    } else {
      setFilteredMunicipalities([])
    }
  }, [selectedDept, municipalities])

  const handleContinue = () => {
    if (selectedMunic) {
      const munic = municipalities.find((m) => m.id === selectedMunic)
      if (munic) {
        sessionStorage.setItem('selectedLocation', JSON.stringify(munic))
        setCurrentLocation(`${munic.name}, ${munic.department}`)
        setSelectedDept('')
        setSelectedMunic('')
        onClose()
        window.location.reload()
      }
    }
  }

  const loading = deptsLoading || municsLoading

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Cambiar ubicación</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        {currentLocation && (
          <p className="mb-6 text-sm text-muted-foreground">
            Ubicación actual: <span className="font-semibold text-foreground">{currentLocation}</span>
          </p>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Departamento</label>
            <Select
              value={selectedDept}
              onValueChange={(dept) => {
                setSelectedDept(dept)
                setSelectedMunic('')
              }}
              items={Object.fromEntries(departments.map((d) => [d, d]))}
            >
              <SelectTrigger className="transition-colors hover:border-primary hover:bg-accent">
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
              <label className="mb-2 block text-sm font-medium">Municipio</label>
              <Select
                value={selectedMunic}
                onValueChange={setSelectedMunic}
                items={Object.fromEntries(filteredMunicipalities.map((m) => [m.id, m.name]))}
              >
                <SelectTrigger className="transition-colors hover:border-primary hover:bg-accent">
                  <SelectValue placeholder="Selecciona un municipio" />
                </SelectTrigger>
                <SelectContent>
                  {filteredMunicipalities.map((munic) => (
                    <SelectItem key={munic.id} value={munic.id}>
                      {munic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 transition-all hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!selectedMunic}
              className="flex-1 transition-all hover:shadow-md disabled:opacity-50"
            >
              Actualizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
