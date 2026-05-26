import { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router"
import { Users, BadgeCheck, Wallet, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/shared/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { getEmployees, verifyEmployee, payEmployee, type Employee } from "@/api/hrService"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export default function EmployeeList() {
  const queryClient = useQueryClient()
  const [payEmployeeData, setPayEmployeeData] = useState<Employee | null>(null)
  const [payOpen, setPayOpen] = useState(false)
  const [payMonth, setPayMonth] = useState("")
  const [payYear, setPayYear] = useState(currentYear)

  const { data: employees, isLoading } = useQuery({
    queryKey: ["hr", "employees"],
    queryFn: getEmployees,
  })

  const verifyMutation = useMutation({
    mutationFn: (id: string) => verifyEmployee(id),
    onSuccess: () => {
      toast.success("Employee verified successfully")
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to verify employee")
    },
  })

  const payMutation = useMutation({
    mutationFn: ({ id, month, year, amount }: { id: string; month: string; year: number; amount: number }) =>
      payEmployee(id, { month, year, amount }),
    onSuccess: () => {
      toast.success("Payment recorded successfully")
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] })
      setPayOpen(false)
      setPayEmployeeData(null)
      setPayMonth("")
      setPayYear(currentYear)
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to process payment")
    },
  })

  const openPayDialog = (employee: Employee) => {
    setPayEmployeeData(employee)
    setPayMonth("")
    setPayYear(currentYear)
    setPayOpen(true)
  }

  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link
            to={`/dashboard/details/${row.original._id}`}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {row.original.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-text/40">{row.original.email}</p>
            </div>
          </Link>
        ),
      },
      {
        accessorKey: "designation",
        header: "Designation",
        cell: ({ getValue }) => (
          <span className="capitalize">{String(getValue()) || "—"}</span>
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
        accessorKey: "isVerified",
        header: "Status",
        cell: ({ getValue, row }) => {
          const verified = getValue() as boolean
          return (
            <div className="flex items-center gap-2">
              <Badge
                variant={verified ? "default" : "secondary"}
                className={verified ? "bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
              >
                {verified ? "Verified" : row.original.status === "fired" ? "Fired" : "Pending"}
              </Badge>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const employee = row.original
          return (
            <div className="flex items-center gap-2">
              {!employee.isVerified && employee.status === "active" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => verifyMutation.mutate(employee._id)}
                  disabled={verifyMutation.isPending}
                >
                  <BadgeCheck className="size-3.5" />
                  Verify
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                disabled={!employee.isVerified || employee.status === "fired"}
                onClick={() => openPayDialog(employee)}
              >
                <Wallet className="size-3.5" />
                Pay
              </Button>
              <Link to={`/dashboard/details/${employee._id}`}>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="size-3.5" />
                </Button>
              </Link>
            </div>
          )
        },
      },
    ],
    [verifyMutation],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Employee List</h1>
        <p className="text-sm text-text/60">Manage and verify employees</p>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <Users className="size-5 text-primary" />
            All Employees
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={employees ?? []}
            loading={isLoading}
            emptyMessage="No employees found"
          />
        </CardContent>
      </Card>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Pay Employee</DialogTitle>
            <DialogDescription>
              Record a salary payment for {payEmployeeData?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Month</Label>
              <Select value={payMonth} onValueChange={(v) => v && setPayMonth(v)}>
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
              <Select value={String(payYear)} onValueChange={(v) => v && setPayYear(Number(v))}>
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
            <div className="space-y-2">
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={payEmployeeData?.salary ?? 0}
                readOnly
                className="bg-muted"
              />
              <p className="text-xs text-text/40">
                Amount is based on employee's current salary
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!payMonth) {
                  toast.error("Please select a month")
                  return
                }
                if (!payEmployeeData) return
                payMutation.mutate({
                  id: payEmployeeData._id,
                  month: payMonth,
                  year: payYear,
                  amount: payEmployeeData.salary,
                })
              }}
              disabled={!payMonth || payMutation.isPending}
              className="w-full"
            >
              {payMutation.isPending ? "Processing..." : "Confirm Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
