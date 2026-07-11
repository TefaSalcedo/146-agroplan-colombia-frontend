import { Skeleton } from "@/components/ui/skeleton"

interface PageLoadingProps {
  title?: string
}

export function PageLoading({ title }: PageLoadingProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {title ? <p className="text-sm font-medium text-primary">{title}</p> : null}
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
  )
}
