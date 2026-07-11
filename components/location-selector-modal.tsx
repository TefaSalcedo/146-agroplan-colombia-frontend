'use client'

import { useState, useEffect } from 'react'
import { MapPin, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useMunicipalities, useDepartments } from '@/hooks'
import type { Municipality } from '@/types'
import { useLocation } from '@/context/LocationContext'
import { fetchMunicipality } from '@/lib/api-client/municipalities'
import { ApiError } from '@/lib/api-client/client'

interface LocationSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LocationSelectorModal({ isOpen, onClose }: LocationSelectorModalProps) {
  const { selectedLocation, setSelectedLocation } = useLocation()
  const { departments, loading: deptsLoading } = useDepartments()
  const { municipalities, loading: municsLoading } = useMunicipalities()
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedMunic, setSelectedMunic] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [filteredMunicipalities, setFilteredMunicipalities] = useState<Municipality[]>([])

  useEffect(() => {
    if (!selectedLocation) return
    setSelectedDept(selectedLocation.department)
    setSelectedMunic(selectedLocation.id)
  }, [selectedLocation])

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

  const handleContinue = async () => {
    if (!selectedMunic) return
    setIsUpdating(true)
    try {
      const municipality = await fetchMunicipality(selectedMunic)
      setSelectedLocation(municipality)
      onClose()
    } catch (error) {
      const message =
        error instanceof ApiError && error.status === 404
          ? 'No encontramos el municipio seleccionado en el backend. Intenta con otro municipio.'
          : 'No pudimos actualizar la ubicación desde el backend. Inténtalo de nuevo.'
      alert(message)
    } finally {
      setIsUpdating(false)
    }
  }

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

        {selectedLocation && (
          <p className="mb-6 text-sm text-muted-foreground">
            Ubicación actual: <span className="font-semibold text-foreground">{selectedLocation.name}, {selectedLocation.department}</span>
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
              disabled={deptsLoading}
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
                onValueChange={(value) => setSelectedMunic(value)}
                disabled={municsLoading || filteredMunicipalities.length === 0}
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
              disabled={!selectedMunic || isUpdating}
              className="flex-1 transition-all hover:shadow-md disabled:opacity-50"
            >
              {isUpdating ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
