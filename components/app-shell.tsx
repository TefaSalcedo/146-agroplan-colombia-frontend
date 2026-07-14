"use client"

import { Suspense, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { MobileTopbar } from "@/components/mobile-topbar"
import { cn } from "@/lib/utils"

function SidebarFallback() {
  return (
    <aside className="flex h-full w-full flex-col overflow-y-auto border-r border-border bg-sidebar">
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-sidebar-accent" />
      </div>
    </aside>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isMapRoute = pathname.startsWith("/mapa/")

  return (
    <div className={cn("flex bg-background", isMapRoute ? "h-screen w-screen overflow-hidden" : "min-h-svh")}>
      <div className={cn("hidden w-80 shrink-0 sticky top-0 bg-sidebar md:block", isMapRoute ? "h-full" : "h-svh")}>
        <Suspense fallback={<SidebarFallback />}>
          <AppSidebar />
        </Suspense>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main
          className={
            isMapRoute
              ? "relative mx-auto w-full flex-1 p-0 pb-20 md:pb-0 overflow-hidden"
              : "mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8"
          }
        >
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
