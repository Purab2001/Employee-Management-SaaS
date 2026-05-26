import { useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { Wallet } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPayments, type Payment } from "@/api/employeeService"

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
  const { data, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getPayments(1, 10),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Payment History</h1>
        <p className="text-sm text-text/60">View your salary payment history</p>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <Wallet className="size-5 text-primary" />
            Salary Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data?.payments ?? []}
            loading={isLoading}
            emptyMessage="No payment history yet"
          />
        </CardContent>
      </Card>
    </div>
  )
}
