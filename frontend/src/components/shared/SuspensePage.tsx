import { Suspense, type ReactNode } from "react"
import { PageFrame } from "@/components/shared/PageTransition"
import { Skeleton } from "@/components/ui/skeleton"

export function SuspensePage({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4 sm:p-6 lg:p-8">
          <Skeleton className="h-8 w-48" shimmer />
          <Skeleton className="h-4 w-64" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-32 w-full rounded-xl" shimmer />
            <Skeleton className="h-32 w-full rounded-xl" shimmer />
          </div>
        </div>
      }
    >
      <PageFrame>{children}</PageFrame>
    </Suspense>
  )
}
