"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { searchMunicipalities } from "@/lib/api-client/municipalities"
import { ApiError } from "@/lib/api-client/client"
import type { Municipality } from "@/types"

interface MunicipalitySearchAutocompleteProps {
  value?: string
  selectedMunicipality?: Municipality | null
  onSelect: (municipality: Municipality | null) => void
  placeholder?: string
  disabled?: boolean
  onSearchStateChange?: (isSearching: boolean) => void
  /** Renders an extra hint when the search returns no results */
  noResultsHint?: React.ReactNode
}

const MIN_SEARCH_LENGTH = 2
const DEBOUNCE_MS = 250

export function MunicipalitySearchAutocomplete({
  value,
  selectedMunicipality,
  onSelect,
  placeholder = "Escribe al menos 2 letras para buscar municipio...",
  disabled = false,
  onSearchStateChange,
  noResultsHint,
}: MunicipalitySearchAutocompleteProps) {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSearchedTermRef = useRef<string>("")

  const options: ComboboxOption[] = useMemo(() => {
    return results.map((m) => ({
      value: m.id,
      label: m.name,
      description: m.department,
    }))
  }, [results])

  const performSearch = useCallback(async (term: string) => {
    const normalizedTerm = term.trim()

    if (normalizedTerm.length < MIN_SEARCH_LENGTH) {
      setResults([])
      setError(null)
      onSearchStateChange?.(false)
      return
    }

    if (normalizedTerm === lastSearchedTermRef.current) {
      return
    }

    setLoading(true)
    setError(null)
    onSearchStateChange?.(true)

    try {
      const response = await searchMunicipalities(normalizedTerm, 20)
      lastSearchedTermRef.current = normalizedTerm
      const mapped: Municipality[] = response
        .filter((item) => item.type === "municipality")
        .map((item) => ({
          id: item.municipalityId ?? item.id,
          name: item.name,
          department: item.departmentName ?? "",
          departmentId: item.departmentId,
          lat: 0,
          lng: 0,
          altitude: 0,
          avgTemperature: 0,
          precipitation: 0,
          suitability: {},
        }))
      setResults(mapped)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Error al buscar municipios"
      setError(message)
      setResults([])
    } finally {
      setLoading(false)
      onSearchStateChange?.(false)
    }
  }, [onSearchStateChange])

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(search)
    }, DEBOUNCE_MS)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [search, performSearch])

  useEffect(() => {
    if (!value && !selectedMunicipality) {
      setSearch("")
      return
    }
    const target = selectedMunicipality ?? results.find((m) => m.id === value)
    if (target) {
      setSearch(`${target.name}, ${target.department}`)
    }
  }, [value, selectedMunicipality, results])

  const handleValueChange = (selectedId: string) => {
    const selected = results.find((m) => m.id === selectedId)
    if (selected) {
      onSelect(selected)
      setSearch(`${selected.name}, ${selected.department}`)
    }
  }

  const handleInputChange = (newValue: string) => {
    setSearch(newValue)
    if (newValue === "") {
      onSelect(null)
      setResults([])
      setError(null)
      lastSearchedTermRef.current = ""
    }
  }

  const showEmptyHint =
    search.trim().length >= MIN_SEARCH_LENGTH && !loading && results.length === 0

  const emptyMessage = error
    ? error
    : showEmptyHint
      ? "No encontramos resultados para tu búsqueda."
      : "Escribe tu municipio para buscar..."

  return (
    <div className="relative">
      <Combobox
        options={options}
        value={value}
        onValueChange={handleValueChange}
        inputValue={search}
        onInputChange={handleInputChange}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        loading={loading || disabled}
        inputClassName="pl-10"
      />
      {showEmptyHint && noResultsHint && (
        <div className="mt-2 text-xs text-muted-foreground">{noResultsHint}</div>
      )}
    </div>
  )
}
