import { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router"
import { Users, BadgeCheck, Wallet, ExternalLink, User } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/shared/DataTable"
import { ViewToggle } from "@/components/shared/ViewToggle"
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
import { useMediaQuery } from "@/hooks/useMediaQuery"

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

  const isMobile = useMediaQuery("(max-width: 640px)")
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  const { data: employees, isLoading, isError, refetch } = useQuery({
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

  const empList = employees ?? []

  const cardView = isMobile && viewMode === "card" ? (
    <div className="grid gap-3">
      {empList.map((emp) => (
        <Card key={emp._id} className="border-primary/10 bg-bg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
          <CardContent className="p-4">
            <Link to={`/dashboard/details/${emp._id}`} className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{emp.name}</p>
                <p className="text-xs text-text/40 truncate">{emp.email}</p>
              </div>
              <Badge
                variant={emp.isVerified ? "default" : "secondary"}
                className={emp.isVerified ? "bg-green-500/10 text-green-600" : ""}
              >
                {emp.isVerified ? "Verified" : emp.status === "fired" ? "Fired" : "Pending"}
              </Badge>
            </Link>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-text/60">{emp.designation || "—"}</span>
              <span className="font-medium">${emp.salary.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex gap-2">
              {!emp.isVerified && emp.status === "active" && (
                <Button size="xs" variant="outline" onClick={() => verifyMutation.mutate(emp._id)}>
                  <BadgeCheck className="size-3" />
                  Verify
                </Button>
              )}
              <Button size="xs" variant="outline" disabled={!emp.isVerified || emp.status === "fired"} onClick={() => openPayDialog(emp)}>
                <Wallet className="size-3" />
                Pay
              </Button>
              <Link to={`/dashboard/details/${emp._id}`}>
                <Button size="xs" variant="ghost">
                  <ExternalLink className="size-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ) : undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Employee List</h1>
        <p className="text-sm text-text/60">Manage and verify employees</p>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-lg font-heading">
            <span className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              All Employees
            </span>
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={empList}
            loading={isLoading}
            isError={isError}
            onRetry={() => refetch()}
            emptyMessage="No employees found"
            emptyIcon={User}
            cardView={cardView}
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
              <Label htmlFor="pay-month">Month</Label>
              <Select value={payMonth} onValueChange={(v) => v && setPayMonth(v)}>
                <SelectTrigger id="pay-month" className="w-full">
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
              <Label htmlFor="pay-year">Year</Label>
              <Select value={String(payYear)} onValueChange={(v) => v && setPayYear(Number(v))}>
                <SelectTrigger id="pay-year" className="w-full">
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
              <Label htmlFor="pay-amount">Amount ($)</Label>
              <Input
                id="pay-amount"
                type="number"
                value={payEmployeeData?.salary ?? 0}
                readOnly
                className="bg-muted"
              />
              <p id="pay-amount-hint" className="text-xs text-text/40">
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
