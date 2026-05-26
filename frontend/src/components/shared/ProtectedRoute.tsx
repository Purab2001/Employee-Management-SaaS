import { Navigate, Outlet } from "react-router"
import { useAuth } from "@/hooks/useAuth"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"

interface ProtectedRouteProps {
  children?: ReactNode
  roles?: ("employee" | "hr" | "admin")[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md space-y-4 p-8">
          <Skeleton className="mx-auto h-8 w-48" shimmer />
          <Skeleton className="mx-auto h-4 w-64" />
          <Skeleton className="mx-auto mt-6 h-4 w-48" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
