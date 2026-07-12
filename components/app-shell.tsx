import { Suspense, type ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { MobileTopbar } from "@/components/mobile-topbar"

function SidebarFallback() {
  return (
    <aside className="sticky top-0 hidden h-svh shrink-0 flex-col overflow-y-auto border-r border-border bg-sidebar self-start md:flex md:w-80">
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-sidebar-accent" />
      </div>
    </aside>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <AppSidebar />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10 md:pt-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
