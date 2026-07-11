import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>

      <Skeleton className="h-64 w-full rounded-2xl" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        </div>
      </div>

      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  )
}
