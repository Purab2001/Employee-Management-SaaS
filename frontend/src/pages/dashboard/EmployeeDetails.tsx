import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { User, Mail, Briefcase, DollarSign, CreditCard, BadgeCheck, Clock, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import { getEmployeeById, getEmployeePayments } from "@/api/hrService"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>()

  const { data: details, isLoading: loadingDetails, isError: detailsError, refetch: refetchDetails } = useQuery({
    queryKey: ["hr", "employee", id],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id,
  })

  const { data: payments, isLoading: loadingPayments, isError: paymentsError, refetch: refetchPayments } = useQuery({
    queryKey: ["hr", "employee", id, "payments"],
    queryFn: () => getEmployeePayments(id!),
    enabled: !!id,
  })

  if (loadingDetails) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" shimmer />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" shimmer />
          <Skeleton className="h-64 rounded-xl" shimmer />
        </div>
      </div>
    )
  }

  if (detailsError) {
    return (
      <div className="space-y-6">
        <ErrorState
          title="Failed to load employee"
          message="Could not fetch employee details. Please try again."
          onRetry={() => refetchDetails()}
        />
      </div>
    )
  }

  if (!details) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-text/40">Employee not found</p>
      </div>
    )
  }

  const { employee, stats } = details

  const chartData = (payments ?? []).map((p) => ({
    name: `${p.month.slice(0, 3)} ${p.year}`,
    amount: p.amount,
  }))

  const infoRows = [
    { icon: Mail, label: "Email", value: employee.email },
    { icon: Briefcase, label: "Designation", value: employee.designation || "—" },
    { icon: DollarSign, label: "Salary", value: `$${employee.salary.toLocaleString()}` },
    { icon: CreditCard, label: "Bank Account", value: employee.bank_account_no || "—" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Employee Details</h1>
        <p className="text-sm text-text/60">View employee profile and salary history</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/10 bg-bg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-heading">
              <User className="size-5 text-primary" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                {employee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{employee.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge
                    variant={employee.isVerified ? "default" : "secondary"}
                    className={
                      employee.isVerified
                        ? "bg-green-500/10 text-green-600"
                        : employee.status === "fired"
                          ? "bg-red-500/10 text-red-600"
                          : ""
                    }
                  >
                    {employee.isVerified ? "Verified" : employee.status === "fired" ? "Fired" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3" role="list">
              {infoRows.map((row) => {
                const Icon = row.icon
                return (
                  <div key={row.label} className="flex items-center gap-3 text-sm" role="listitem">
                    <Icon className="size-4 shrink-0 text-text/40" aria-hidden="true" />
                    <span className="text-text/60 min-w-24">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-bg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-heading">
              <BadgeCheck className="size-5 text-primary" />
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <Clock className="size-4 text-primary" />
                  Total Work Hours
                </div>
                <p className="mt-1 text-2xl font-bold">{stats.totalWorkHours.toFixed(1)}</p>
              </div>
              <div className="rounded-lg bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-sm text-text/60">
                  <Wallet className="size-4 text-primary" />
                  Total Payments
                </div>
                <p className="mt-1 text-2xl font-bold">{stats.totalPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <DollarSign className="size-5 text-primary" />
            Salary History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPayments ? (
            <Skeleton className="h-64 w-full rounded-lg" shimmer />
          ) : paymentsError ? (
            <div className="flex h-64 items-center justify-center">
              <ErrorState
                title="Failed to load payment history"
                message="Could not fetch payment data."
                onRetry={() => refetchPayments()}
              />
            </div>
          ) : chartData.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="No payment history yet"
              description="Payments will appear here once salary is processed"
            />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-primary)" strokeOpacity={0.1} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "var(--color-text)" }}
                    tickLine={false}
                    axisLine={{ stroke: "var(--color-primary)", strokeOpacity: 0.1 }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--color-text)" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v ?? 0).toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-bg)",
                      border: "1px solid var(--color-primary)",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [`$${(value ?? 0).toLocaleString()}`, "Amount"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
