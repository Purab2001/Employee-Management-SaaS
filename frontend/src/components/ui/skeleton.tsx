import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  shimmer?: boolean
}

function Skeleton({ className, shimmer = false, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md bg-muted",
        shimmer ? "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]" : "animate-pulse",
        className,
      )}
      {...props}
    />
  )
}

export { Skeleton }
