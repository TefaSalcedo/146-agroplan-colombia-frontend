"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"
import { Search, Check } from "lucide-react"

interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onValueChange?: (value: string) => void
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
  placeholder = "Buscar...",
  emptyMessage = "No se encontraron resultados",
  loading = false,
  disabled = false,
  className,
  inputClassName,
}: ComboboxProps) {
  const [inputValue, setInputValue] = React.useState("")

  const selectedLabel = React.useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? ""
  }, [options, value])

  React.useEffect(() => {
    if (value && selectedLabel) {
      setInputValue(selectedLabel)
    }
  }, [value, selectedLabel])

  return (
    <ComboboxPrimitive.Root
      value={value}
      onValueChange={(v) => {
        onValueChange?.(v ?? "")
      }}
      className={cn("relative", className)}
    >
      <ComboboxPrimitive.Control className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <ComboboxPrimitive.Input
          disabled={disabled || loading}
          placeholder={loading ? "Cargando..." : placeholder}
          className={cn(
            "w-full rounded-lg border border-input bg-transparent py-2.5 pr-9 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            inputClassName
          )}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </ComboboxPrimitive.Control>

      <ComboboxPrimitive.Positioner className="z-50" sideOffset={4}>
        <ComboboxPrimitive.Popup
          className={cn(
            "max-h-72 min-w-(--anchor-width) overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none",
            options.length === 0 && inputValue.length > 0 ? "p-3" : ""
          )}
        >
          {options.length === 0 && inputValue.length > 0 ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            options.map((option) => (
              <ComboboxPrimitive.Item
                key={option.value}
                value={option.value}
                className="relative flex w-full cursor-default items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[selected]:bg-accent data-[selected]:text-accent-foreground"
              >
                <ComboboxPrimitive.ItemText className="flex flex-1 flex-col">
                  <span className="font-medium">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  )}
                </ComboboxPrimitive.ItemText>
                <ComboboxPrimitive.ItemIndicator>
                  <Check className="size-4" />
                </ComboboxPrimitive.ItemIndicator>
              </ComboboxPrimitive.Item>
            ))
          )}
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Root>
  )
}

export { Combobox, type ComboboxOption }
