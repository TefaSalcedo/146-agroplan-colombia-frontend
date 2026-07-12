"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Search, Check } from "lucide-react"

export interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
  inputValue?: string
  onInputChange?: (value: string) => void
  placeholder?: string
  emptyMessage?: string
  loading?: boolean
  disabled?: boolean
  className?: string
  inputClassName?: string
}

function Combobox({
  options,
  value,
  onValueChange,
  inputValue: inputValueProp,
  onInputChange,
  placeholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  loading = false,
  disabled = false,
  className,
  inputClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [internalInputValue, setInternalInputValue] = React.useState("")
  const containerRef = React.useRef<HTMLDivElement>(null)
  const listboxId = React.useId()

  const inputValue = inputValueProp ?? internalInputValue

  const selectedLabel = React.useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? ""
  }, [options, value])

  React.useEffect(() => {
    if (value && selectedLabel && inputValueProp === undefined) {
      setInternalInputValue(selectedLabel)
    }
  }, [value, selectedLabel, inputValueProp])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option: ComboboxOption) => {
    onValueChange?.(option.value)
    onInputChange?.(option.label)
    setInternalInputValue(option.label)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (inputValueProp === undefined) {
      setInternalInputValue(newValue)
    }
    onInputChange?.(newValue)
    // Only open dropdown if there are 2 or more characters or if it's empty (to show the help message)
    if (newValue.length >= 2 || newValue === "") {
      setOpen(true)
    } else {
      setOpen(false)
    }
    if (newValue === "") {
      onValueChange?.("")
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          role="combobox"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-autocomplete="list"
          disabled={disabled || loading}
          placeholder={loading ? "Cargando..." : placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          minLength={1}
          className={cn(
            "w-full rounded-lg border border-input bg-transparent py-2.5 pr-4 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            inputClassName
          )}
        />
      </div>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {options.length === 0 ? (
            <li className="py-4 text-center text-sm text-muted-foreground">
              {inputValue.trim() === "" ? "Escribe tu municipio para buscar..." : emptyMessage}
            </li>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent text-accent-foreground"
                  )}
                >
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground">
                        {option.description}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="size-4" />}
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}

export { Combobox }
