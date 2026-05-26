import { useMemo, useState, useCallback, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { ListChecks, UserX, UserCog, DollarSign, User } from "lucide-react"
import { toast } from "sonner"
import { DataTable } from "@/components/shared/DataTable"
import { ViewToggle } from "@/components/shared/ViewToggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useConfirm } from "@/hooks/useConfirm"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getAllEmployees,
  promoteToHR,
  fireEmployee,
  updateSalary,
  type AdminEmployee,
} from "@/api/adminService"
import { useMediaQuery } from "@/hooks/useMediaQuery"

export default function AllEmployeeList() {
  const queryClient = useQueryClient()
  const { confirm, confirmState, handleConfirm, handleCancel } = useConfirm()
  const [salaryTarget, setSalaryTarget] = useState<AdminEmployee | null>(null)
  const [salaryOpen, setSalaryOpen] = useState(false)
  const [newSalary, setNewSalary] = useState("")
  const salaryTargetRef = useRef<string | null>(null)

  const isMobile = useMediaQuery("(max-width: 640px)")
  const [viewMode, setViewMode] = useState<"table" | "card">("table")

  const { data: employees, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "employees"],
    queryFn: getAllEmployees,
  })

  const promoteMutation = useMutation({
    mutationFn: (id: string) => promoteToHR(id),
    onSuccess: () => {
      toast.success("Employee promoted to HR successfully")
      queryClient.invalidateQueries({ queryKey: ["admin", "employees"] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to promote employee")
    },
  })

  const fireMutation = useMutation({
    mutationFn: (id: string) => fireEmployee(id),
    onSuccess: () => {
      toast.success("Employee fired successfully")
      queryClient.invalidateQueries({ queryKey: ["admin", "employees"] })
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to fire employee")
    },
  })

  const salaryMutation = useMutation({
    mutationFn: ({ id, salary }: { id: string; salary: number }) =>
      updateSalary(id, salary),
    onSuccess: (_data, variables) => {
      if (variables.id !== salaryTargetRef.current) return
      toast.success("Salary increased successfully")
      queryClient.invalidateQueries({ queryKey: ["admin", "employees"] })
      setSalaryOpen(false)
      setSalaryTarget(null)
      setNewSalary("")
      salaryTargetRef.current = null
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || "Failed to update salary")
    },
  })

  const handlePromote = useCallback(async (employee: AdminEmployee) => {
    const confirmed = await confirm({
      title: "Promote to HR",
      message: `Are you sure you want to promote ${employee.name} to HR? They will gain access to HR management features.`,
      confirmLabel: "Promote",
      variant: "default",
    })
    if (confirmed) {
      promoteMutation.mutate(employee._id)
    }
  }, [confirm, promoteMutation])

  const handleFire = useCallback(async (employee: AdminEmployee) => {
    const confirmed = await confirm({
      title: "Fire Employee",
      message: `Are you sure you want to fire ${employee.name}? This action cannot be undone. They will lose access to the platform.`,
      confirmLabel: "Fire",
      variant: "destructive",
    })
    if (confirmed) {
      fireMutation.mutate(employee._id)
    }
  }, [confirm, fireMutation])

  const openSalaryDialog = (employee: AdminEmployee) => {
    setSalaryTarget(employee)
    salaryTargetRef.current = employee._id
    setNewSalary(String(employee.salary))
    setSalaryOpen(true)
  }

  const empList = employees ?? []

  const columns = useMemo<ColumnDef<AdminEmployee>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {row.original.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-text/40">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "designation",
        header: "Designation",
        cell: ({ getValue }) => (
          <span className="capitalize">{(getValue() as string | undefined) || "—"}</span>
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
        accessorKey: "role",
        header: "Role",
        cell: ({ getValue }) => {
          const role = getValue() as string
          return (
            <Badge
              variant={role === "admin" ? "default" : "secondary"}
              className={
                role === "admin"
                  ? "bg-primary/10 text-primary"
                  : role === "hr"
                    ? "bg-blue-500/10 text-blue-600"
                    : "bg-text/5 text-text/60"
              }
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          )
        },
      },
      {
        accessorKey: "isVerified",
        header: "Verified",
        cell: ({ getValue }) => {
          const verified = getValue() as boolean
          return (
            <span className={verified ? "text-green-600" : "text-text/40"}>
              {verified ? "Yes" : "No"}
            </span>
          )
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue() as string
          return (
            <Badge
              variant={status === "active" ? "default" : "destructive"}
              className={
                status === "active"
                  ? "bg-green-500/10 text-green-600"
                  : "bg-red-500/10 text-red-600"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const employee = row.original
          const isEmployee = employee.role === "employee"
          const isActive = employee.status === "active"

          return (
            <div className="flex items-center gap-2">
              {isEmployee && isActive && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePromote(employee)}
                    disabled={promoteMutation.isPending}
                  >
                    <UserCog className="size-3.5" />
                    Make HR
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openSalaryDialog(employee)}
                  >
                    <DollarSign className="size-3.5" />
                    Salary
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleFire(employee)}
                    disabled={fireMutation.isPending}
                  >
                    <UserX className="size-3.5" />
                    Fire
                  </Button>
                </>
              )}
              {!isActive && (
                <Badge variant="secondary" className="bg-text/5 text-text/40">
                  Inactive
                </Badge>
              )}
            </div>
          )
        },
      },
    ],
    [promoteMutation, fireMutation, handleFire, handlePromote],
  )

  const cardView = isMobile && viewMode === "card" ? (
    <div className="grid gap-3">
      {empList.map((emp) => {
        const isEmployee = emp.role === "employee"
        const isActive = emp.status === "active"
        return (
          <Card key={emp._id} className="border-primary/10 bg-bg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {emp.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{emp.name}</p>
                  <p className="text-xs text-text/40 truncate">{emp.email}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge
                    variant={emp.role === "admin" ? "default" : "secondary"}
                    className={
                      emp.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : emp.role === "hr"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-text/5 text-text/60"
                    }
                  >
                    {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-text/60">{emp.designation || "—"}</span>
                <span className="font-medium">${emp.salary.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className={emp.isVerified ? "text-green-600" : "text-text/40"}>
                  {emp.isVerified ? "Verified" : "Not Verified"}
                </span>
                <span>·</span>
                <Badge
                  variant={emp.status === "active" ? "default" : "destructive"}
                  className={
                    emp.status === "active"
                      ? "bg-green-500/10 text-green-600 px-1.5 py-0 text-[10px]"
                      : "bg-red-500/10 text-red-600 px-1.5 py-0 text-[10px]"
                  }
                >
                  {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                </Badge>
              </div>
              {isEmployee && isActive && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="xs" variant="outline" onClick={() => handlePromote(emp)}>
                    <UserCog className="size-3" />
                    Make HR
                  </Button>
                  <Button size="xs" variant="outline" onClick={() => openSalaryDialog(emp)}>
                    <DollarSign className="size-3" />
                    Salary
                  </Button>
                  <Button size="xs" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleFire(emp)}>
                    <UserX className="size-3" />
                    Fire
                  </Button>
                </div>
              )}
              {!isActive && (
                <div className="mt-3">
                  <Badge variant="secondary" className="bg-text/5 text-text/40 text-xs">Inactive</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  ) : undefined

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">All Employees</h1>
        <p className="text-sm text-text/60">Manage all employees, roles, and statuses</p>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-lg font-heading">
            <span className="flex items-center gap-2">
              <ListChecks className="size-5 text-primary" />
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

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        variant={confirmState.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      <Dialog open={salaryOpen} onOpenChange={(open) => { if (!open) salaryTargetRef.current = null; setSalaryOpen(open) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Increase Salary</DialogTitle>
            <DialogDescription>
              Update salary for {salaryTarget?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-salary">Current Salary ($)</Label>
              <Input
                id="current-salary"
                type="number"
                value={salaryTarget?.salary ?? 0}
                readOnly
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-salary">New Salary ($)</Label>
              <Input
                id="new-salary"
                type="number"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                min={(salaryTarget?.salary ?? 0) + 1}
                placeholder="Enter new salary"
                aria-describedby="salary-hint"
              />
              <p id="salary-hint" className="text-xs text-text/40">
                Salary can only be increased
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                const salaryNum = Number(newSalary)
                if (!salaryNum || salaryNum <= 0) {
                  toast.error("Please enter a valid salary amount")
                  return
                }
                if (salaryNum <= (salaryTarget?.salary ?? 0)) {
                  toast.error("New salary must be higher than current salary")
                  return
                }
                if (!salaryTarget) return
                salaryMutation.mutate({
                  id: salaryTarget._id,
                  salary: salaryNum,
                })
              }}
              disabled={salaryMutation.isPending}
              className="w-full"
            >
              {salaryMutation.isPending ? "Updating..." : "Update Salary"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
