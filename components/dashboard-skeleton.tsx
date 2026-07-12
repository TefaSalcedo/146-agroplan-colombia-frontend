import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* General info */}
      <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>

      {/* Sowing */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="size-9 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="flex gap-3 overflow-x-hidden pb-2">
            <Skeleton className="aspect-[4/3] w-44 shrink-0 rounded-2xl sm:w-48" />
            <Skeleton className="aspect-[4/3] w-44 shrink-0 rounded-2xl sm:w-48" />
            <Skeleton className="aspect-[4/3] w-44 shrink-0 rounded-2xl sm:w-48" />
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>

      {/* Alerts + Harvest */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="flex gap-3 overflow-x-hidden pb-2">
            <Skeleton className="aspect-[4/3] w-52 shrink-0 rounded-2xl" />
            <Skeleton className="aspect-[4/3] w-52 shrink-0 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Zone recommendations */}
      <div className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="flex gap-3 overflow-x-hidden pb-2">
            <Skeleton className="aspect-[4/3] w-44 shrink-0 rounded-2xl sm:w-48" />
            <Skeleton className="aspect-[4/3] w-44 shrink-0 rounded-2xl sm:w-48" />
            <Skeleton className="aspect-[4/3] w-44 shrink-0 rounded-2xl sm:w-48" />
          </div>
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>

      {/* Daily tip */}
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  )
}
