import { useMemo, useState, useEffect, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { useSearchParams, useNavigate } from "react-router"
import { Database, Plus, CheckCircle, XCircle, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/shared/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getPayrolls,
  approvePayroll,
  getAllEmployees,
  createPaymentSession,
  type PayrollRecord,
} from "@/api/adminService"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export default function Payroll() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [approveOpen, setApproveOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [payingId, setPayingId] = useState<string | null>(null)

  useEffect(() => {
    const payment = searchParams.get("payment")
    if (payment === "success") {
      toast.success("Payment completed successfully")
      queryClient.invalidateQueries({ queryKey: ["admin", "payrolls"] })
      navigate("/dashboard/payroll", { replace: true })
    } else if (payment === "cancelled") {
      toast.error("Payment was cancelled")
      navigate("/dashboard/payroll", { replace: true })
    }
  }, [searchParams, queryClient, navigate])

  const { data: payrolls, isLoading: payrollsLoading } = useQuery({
    queryKey: ["admin", "payrolls"],
    queryFn: getPayrolls,
  })

  const { data: employees } = useQuery({
    queryKey: ["admin", "employees"],
    queryFn: getAllEmployees,
  })

  const activeEmployees = useMemo(
    () => (employees ?? []).filter((e) => e.role === "employee" && e.status === "active" && e.isVerified),
    [employees],
  )

  const approveMutation = useMutation({
    mutationFn: (payload: { employeeId: string; month: string; year: number }) =>
      approvePayroll(payload),
    onSuccess: () => {
      toast.success("Payroll approved successfully")
      queryClient.invalidateQueries({ queryKey: ["admin", "payrolls"] })
      setApproveOpen(false)
      setSelectedEmployee("")
      setSelectedMonth("")
      setSelectedYear(currentYear)
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to approve payroll")
    },
  })

  const payMutation = useMutation({
    mutationFn: (payrollId: string) => createPaymentSession(payrollId),
    onSuccess: (data) => {
      window.location.href = data.url
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to process payment")
    },
    onSettled: () => {
      setPayingId(null)
    },
  })

  const handlePay = useCallback((payrollId: string) => {
    setPayingId(payrollId)
    payMutation.mutate(payrollId)
  }, [payMutation])

  const openApproveDialog = () => {
    setSelectedEmployee("")
    setSelectedMonth("")
    setSelectedYear(currentYear)
    setApproveOpen(true)
  }

  const handleApprove = () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee")
      return
    }
    if (!selectedMonth) {
      toast.error("Please select a month")
      return
    }
    approveMutation.mutate({
      employeeId: selectedEmployee,
      month: selectedMonth,
      year: selectedYear,
    })
  }

  const columns = useMemo<ColumnDef<PayrollRecord>[]>(
    () => [
      {
        accessorKey: "employeeId",
        header: "Employee",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {row.original.employeeId?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div>
              <p className="font-medium">{row.original.employeeId?.name ?? "Unknown"}</p>
              <p className="text-xs text-text/40">{row.original.employeeEmail}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ getValue }) => (
          <span className="font-medium">
            ${(getValue() as number).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "month",
        header: "Month",
        cell: ({ getValue }) => (
          <span className="capitalize">{String(getValue())}</span>
        ),
      },
      {
        accessorKey: "year",
        header: "Year",
      },
      {
        accessorKey: "paid",
        header: "Status",
        cell: ({ getValue }) => {
          const paid = getValue() as boolean
          return paid ? (
            <Badge className="bg-green-500/10 text-green-600">
              <CheckCircle className="mr-1 size-3" />
              Paid
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
              <XCircle className="mr-1 size-3" />
              Pending
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const record = row.original
          const isLoading = payingId === record._id

          if (record.paid) {
            return (
              <Badge variant="secondary" className="bg-text/5 text-text/40">
                Paid
              </Badge>
            )
          }

          return (
            <Button
              size="sm"
              onClick={() => handlePay(record._id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <ExternalLink className="mr-1 size-3.5" />
              )}
              Pay Now
            </Button>
          )
        },
      },
    ],
    [payingId, handlePay],
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Payroll</h1>
          <p className="text-sm text-text/60">Approve and manage salary payments</p>
        </div>
        <Button onClick={openApproveDialog}>
          <Plus className="mr-1 size-4" />
          Approve Payroll
        </Button>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <Database className="size-5 text-primary" />
            Payroll Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={payrolls ?? []}
            loading={payrollsLoading}
            emptyMessage="No payroll records found"
          />
        </CardContent>
      </Card>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Approve Payroll</DialogTitle>
            <DialogDescription>
              Select an employee and period to approve payroll
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select
                value={selectedEmployee}
                onValueChange={(v) => v && setSelectedEmployee(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.name} ({emp.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Month</Label>
              <Select
                value={selectedMonth}
                onValueChange={(v) => v && setSelectedMonth(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year</Label>
              <Select
                value={String(selectedYear)}
                onValueChange={(v) => v && setSelectedYear(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleApprove}
              disabled={!selectedEmployee || !selectedMonth || approveMutation.isPending}
              className="w-full"
            >
              {approveMutation.isPending ? "Approving..." : "Approve Payroll"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
