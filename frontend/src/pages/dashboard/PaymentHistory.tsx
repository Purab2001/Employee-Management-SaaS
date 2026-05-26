import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { Wallet, CreditCard, Calendar } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPayments, type Payment } from "@/api/employeeService"
import { useMediaQuery } from "@/hooks/useMediaQuery"

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "month",
    header: "Month",
    cell: ({ getValue }) => (
      <span className="capitalize">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "year",
    header: "Year",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-medium">
        ${(getValue() as number).toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs text-text/50">
        {(getValue() as string).slice(0, 12)}...
      </span>
    ),
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
  },
]

export default function PaymentHistory() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPayments(1, 10),
  })

  const isMobile = useMediaQuery("(max-width: 640px)")
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  const payments = data?.payments ?? []

  const cardView = isMobile && viewMode === "card" ? (
    <div className="grid gap-3 sm:grid-cols-2">
      {payments.map((p) => (
        <Card key={p._id} className="border-primary/10 bg-bg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">{p.month} {p.year}</Badge>
              <span className="font-heading text-lg font-bold">${p.amount.toLocaleString()}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-text/50">
                <CreditCard className="size-3" />
                <span className="font-mono">{p.transactionId.slice(0, 12)}...</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text/50">
                <Calendar className="size-3" />
                <span>
                  {new Date(p.paymentDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Payment History</h1>
        <p className="text-sm text-text/60">View your salary payment history</p>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-lg font-heading">
            <span className="flex items-center gap-2">
              <Wallet className="size-5 text-primary" />
              Salary Payments
            </span>
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payments}
            loading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            emptyMessage="No payment history yet"
            emptyIcon={Wallet}
            cardView={cardView}
          />
        </CardContent>
      </Card>
    </div>
  )
}
