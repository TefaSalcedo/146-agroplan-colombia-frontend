"use client"

import { useEffect, useMemo, useState } from "react"
import { normalize } from "@/lib/string-utils"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import type { Municipality } from "@/types"

interface MunicipalityAutocompleteProps {
  municipalities: Municipality[]
  value?: string
  onSelect: (municipality: Municipality | null) => void
  loading?: boolean
  placeholder?: string
}

export function MunicipalityAutocomplete({
  municipalities,
  value,
  onSelect,
  loading = false,
  placeholder = "Buscar municipio o vereda...",
}: MunicipalityAutocompleteProps) {
  const [search, setSearch] = useState("")

  const options: ComboboxOption[] = useMemo(() => {
    return municipalities.map((m) => ({
      value: m.id,
      label: `${m.name}`,
      description: `${m.department}`,
    }))
  }, [municipalities])

  const filteredOptions = useMemo(() => {
    const term = normalize(search)
    if (!term) return []
    return options
      .filter((option) => normalize(option.label).includes(term) || normalize(option.description || "").includes(term))
      .slice(0, 8)
  }, [options, search])

  useEffect(() => {
    if (!value) {
      setSearch("")
      return
    }
    const selected = municipalities.find((m) => m.id === value)
    if (selected) {
      setSearch(`${selected.name}, ${selected.department}`)
    }
  }, [value, municipalities])

  const handleValueChange = (selectedId: string) => {
    const selected = municipalities.find((m) => m.id === selectedId)
    if (selected) {
      onSelect(selected)
      setSearch(`${selected.name}, ${selected.department}`)
    }
  }

  const handleInputChange = (newValue: string) => {
    setSearch(newValue)
    if (newValue === "") {
      onSelect(null)
    }
  }

  return (
    <Combobox
      options={filteredOptions}
      value={value}
      onValueChange={handleValueChange}
      inputValue={search}
      onInputChange={handleInputChange}
      placeholder={placeholder}
      emptyMessage="No encontramos ese municipio. Intenta con otro nombre."
      loading={loading}
      inputClassName="pl-10"
    />
  )
}
