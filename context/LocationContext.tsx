'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Municipality } from '@/types'

interface LocationState {
  selectedLocation: Municipality | null
  setSelectedLocation: (location: Municipality | null) => void
  clearLocation: () => void
}

/**
 * Global location store powered by Zustand.
 *
 * The store is persisted to localStorage so the selected department and
 * municipality survive page reloads and navigation between routes.
 *
 * Unlike React Context, Zustand allows accessing the store outside of
 * the React render cycle (e.g. inside API helpers) via `useLocationStore.getState()`.
 */
export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedLocation: null,
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      clearLocation: () => set({ selectedLocation: null }),
    }),
    {
      name: 'selectedLocation',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage
        }
        // SSR-safe fallback: an in-memory storage that mimics the Storage interface.
        const memory: Record<string, string> = {}
        return {
          getItem: (key: string) => memory[key] ?? null,
          setItem: (key: string, value: string) => {
            memory[key] = value
          },
          removeItem: (key: string) => {
            delete memory[key]
          },
        } as Storage
      }),
    }
  )
)

/**
 * Drop-in replacement for the former Context-based `useLocation` hook.
 *
 * Returns the same shape ({ selectedLocation, setSelectedLocation, clearLocation })
 * so existing call sites don't need to change their imports.
 */
export function useLocation() {
  const selectedLocation = useLocationStore((state) => state.selectedLocation)
  const setSelectedLocation = useLocationStore((state) => state.setSelectedLocation)
  const clearLocation = useLocationStore((state) => state.clearLocation)

  return { selectedLocation, setSelectedLocation, clearLocation }
}
