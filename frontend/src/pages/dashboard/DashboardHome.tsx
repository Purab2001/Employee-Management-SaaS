import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Users, Wallet, Clock, FileText } from "lucide-react"

const roleCards = {
  employee: [
    { icon: FileText, label: "Work Logs", value: "0", sub: "This month" },
    { icon: Wallet, label: "Total Earned", value: "$0", sub: "All time" },
  ],
  hr: [
    { icon: Users, label: "Employees", value: "0", sub: "Active" },
    { icon: Clock, label: "Pending Verifications", value: "0", sub: "Awaiting review" },
  ],
  admin: [
    { icon: Building2, label: "Total Employees", value: "0", sub: "All roles" },
    { icon: Wallet, label: "Payroll This Month", value: "$0", sub: "Pending" },
  ],
} as const

export default function DashboardHome() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" shimmer />
        <Skeleton className="h-4 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28 rounded-xl" shimmer />
          <Skeleton className="h-28 rounded-xl" shimmer />
        </div>
      </div>
    )
  }

  if (!user) return null

  const cards = roleCards[user.role as keyof typeof roleCards] ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="text-sm capitalize text-text/60">
          {user.role} Dashboard
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="border-primary/10 bg-bg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-text/60">
                  {card.label}
                </CardTitle>
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="font-heading text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-text/40">{card.sub}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="text-lg font-heading">
            Dashboard Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-text/60">
            Your personalized dashboard is ready. Features for your role will appear here as they are developed.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
