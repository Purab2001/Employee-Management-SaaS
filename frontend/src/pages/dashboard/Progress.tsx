import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { BarChart3, Search, Clock } from "lucide-react"
import { DataTable } from "@/components/shared/DataTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getProgress, getEmployees, type WorkLogEntry } from "@/api/hrService"

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export default function Progress() {
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const { data: employees } = useQuery({
    queryKey: ["hr", "employees"],
    queryFn: getEmployees,
  })

  const { data: progress, isLoading } = useQuery({
    queryKey: ["hr", "progress", selectedEmployee, selectedMonth, selectedYear],
    queryFn: () =>
      getProgress({
        employeeEmail: selectedEmployee || undefined,
        month: selectedMonth || undefined,
        year: selectedYear ? Number(selectedYear) : undefined,
      }),
  })

  const totalHours = progress?.totalHours ?? 0
  const entries = progress?.entries ?? []

  const columns = useMemo<ColumnDef<WorkLogEntry>[]>(
    () => [
      {
        accessorKey: "employeeEmail",
        header: "Employee",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "task",
        header: "Task",
        cell: ({ getValue }) => (
          <span className="capitalize">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "hours",
        header: "Hours",
        cell: ({ getValue }) => (
          <span className="font-medium">{(getValue() as number).toFixed(1)}h</span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Progress</h1>
        <p className="text-sm text-text/60">Track employee work logs and productivity</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Search className="size-4 text-text/40" />
          <span className="text-sm text-text/60">Filters:</span>
        </div>

        <Select value={selectedEmployee} onValueChange={(v) => v && setSelectedEmployee(v === "__all" ? "" : v)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Employees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All Employees</SelectItem>
            {employees?.map((emp) => (
              <SelectItem key={emp._id} value={emp.email}>
                {emp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={(v) => v && setSelectedMonth(v === "__all" ? "" : v)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All Months</SelectItem>
            {MONTHS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={(v) => v && setSelectedYear(v === "__all" ? "" : v)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all">All Years</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/10 bg-bg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-text/60">
              <Clock className="size-4 text-primary" />
              Total Hours
            </div>
            <p className="mt-1 text-2xl font-bold">{totalHours.toFixed(1)}h</p>
          </CardContent>
        </Card>
        <Card className="border-primary/10 bg-bg">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-text/60">
              <BarChart3 className="size-4 text-primary" />
              Total Entries
            </div>
            <p className="mt-1 text-2xl font-bold">{entries.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <BarChart3 className="size-5 text-primary" />
            Work Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={entries}
            loading={isLoading}
            emptyMessage="No work logs found for the selected filters"
          />
        </CardContent>
      </Card>
    </div>
  )
}
