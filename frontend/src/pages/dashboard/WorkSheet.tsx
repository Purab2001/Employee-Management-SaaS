import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Plus, Pencil, Trash2, Loader2, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/shared/ErrorState"
import { EmptyState } from "@/components/shared/EmptyState"
import {
  getWorkSheets,
  createWorkSheet,
  updateWorkSheet,
  deleteWorkSheet,
  type WorkSheetEntry,
} from "@/api/employeeService"

const taskOptions = ["Sales", "Support", "Content", "Paper-work"] as const

const workSheetSchema = z.object({
  task: z.string().min(1, "Task is required"),
  hours: z.string().min(1, "Hours is required"),
  date: z.string().min(1, "Date is required"),
})

type WorkSheetForm = z.infer<typeof workSheetSchema>

export default function WorkSheet() {
  const queryClient = useQueryClient()
  const [editingEntry, setEditingEntry] = useState<WorkSheetEntry | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data: entries, isLoading, isError, refetch } = useQuery({
    queryKey: ["worksheets"],
    queryFn: getWorkSheets,
  })

  const resetForm = () => {
    setEditingEntry(null)
    setSelectedDate(null)
    reset({ task: "", hours: "", date: "" })
  }

  const createMutation = useMutation({
    mutationFn: createWorkSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worksheets"] })
      toast.success("Work entry added")
      resetForm()
    },
    onError: () => toast.error("Failed to add work entry"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { task: string; hours: number; date: string } }) =>
      updateWorkSheet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worksheets"] })
      toast.success("Work entry updated")
      resetForm()
    },
    onError: () => toast.error("Failed to update work entry"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteWorkSheet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worksheets"] })
      toast.success("Work entry deleted")
    },
    onError: () => toast.error("Failed to delete work entry"),
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WorkSheetForm>({
    resolver: zodResolver(workSheetSchema),
    defaultValues: { task: "", hours: "", date: "" },
  })

  const selectedTask = watch("task")

  const startEditing = (entry: WorkSheetEntry) => {
    setEditingEntry(entry)
    setSelectedDate(new Date(entry.date))
    setValue("task", entry.task)
    setValue("hours", String(entry.hours))
    setValue("date", new Date(entry.date).toISOString())
  }

  const cancelEditing = () => {
    resetForm()
  }

  const onSubmit = (data: WorkSheetForm) => {
    const hoursNum = parseFloat(data.hours)
    if (isNaN(hoursNum) || hoursNum < 0.5 || hoursNum > 24) {
      toast.error("Hours must be between 0.5 and 24")
      return
    }
    const payload = { task: data.task, hours: hoursNum, date: data.date }

    if (editingEntry) {
      updateMutation.mutate({ id: editingEntry._id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleDateChange = (d: Date | null) => {
    setSelectedDate(d)
    setValue("date", d ? d.toISOString() : "", { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Work Sheet</h1>
        <p className="text-sm text-text/60">Log and manage your daily work entries</p>
      </div>

      <Card className="border-primary/10 bg-bg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-heading">
            <Plus className="size-5 text-primary" />
            {editingEntry ? "Edit Work Entry" : "Add Work Entry"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="flex flex-col gap-1.5 sm:w-40">
              <Label htmlFor="task" className="text-xs font-medium text-text/60">Task</Label>
              <Select
                value={selectedTask}
                onValueChange={(v) => v && setValue("task", v)}
              >
                <SelectTrigger id="task" aria-describedby="task-error">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {taskOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("task")} />
              {errors.task && (
                <p id="task-error" className="text-xs text-destructive" role="alert">
                  {errors.task.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 sm:w-28">
              <Label htmlFor="hours" className="text-xs font-medium text-text/60">Hours</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="0.5"
                aria-invalid={!!errors.hours}
                aria-describedby={errors.hours ? "hours-error" : "hours-hint"}
                {...register("hours")}
              />
              <p id="hours-hint" className="text-xs text-text/30 hidden sm:block">
                0.5 - 24 hours
              </p>
              {errors.hours && (
                <p id="hours-error" className="text-xs text-destructive" role="alert">
                  {errors.hours.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 sm:w-40">
              <Label htmlFor="work-date" className="text-xs font-medium text-text/60">Date</Label>
              <div className="[&_.react-datepicker-wrapper]:w-full [&_.react-datepicker__input-container>input]:flex [&_.react-datepicker__input-container>input]:h-8 [&_.react-datepicker__input-container>input]:w-full [&_.react-datepicker__input-container>input]:rounded-lg [&_.react-datepicker__input-container>input]:border [&_.react-datepicker__input-container>input]:border-input [&_.react-datepicker__input-container>input]:bg-transparent [&_.react-datepicker__input-container>input]:px-2.5 [&_.react-datepicker__input-container>input]:text-sm [&_.react-datepicker__input-container>input]:outline-none [&_.react-datepicker__input-container>input]:transition-colors [&_.react-datepicker__input-container>input]:focus-visible:border-ring [&_.react-datepicker__input-container>input]:focus-visible:ring-3 [&_.react-datepicker__input-container>input]:focus-visible:ring-ring/50">
                <DatePicker
                  id="work-date"
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Pick a date"
                  aria-describedby={errors.date ? "date-error" : undefined}
                />
              </div>
              <input type="hidden" {...register("date")} />
              {errors.date && (
                <p id="date-error" className="text-xs text-destructive" role="alert">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                {editingEntry ? "Update" : "Add Entry"}
              </Button>
              {editingEntry && (
                <Button type="button" variant="ghost" onClick={cancelEditing}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" shimmer />
          ))}
        </div>
      ) : isError ? (
        <Card className="border-primary/10 bg-bg">
          <CardContent>
            <ErrorState
              title="Failed to load entries"
              message="Could not fetch your work entries. Please try again."
              onRetry={() => refetch()}
            />
          </CardContent>
        </Card>
      ) : entries && entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry._id}
              className="border-primary/10 bg-bg transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{entry.task}</Badge>
                  <span className="text-sm font-medium">{entry.hours}h</span>
                  <span className="text-sm text-text/50">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => startEditing(entry)}
                    aria-label="Edit entry"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => deleteMutation.mutate(entry._id)}
                    aria-label="Delete entry"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/10 bg-bg">
          <CardContent>
            <EmptyState
              icon={ClipboardList}
              title="No work entries yet"
              description="Add your first work entry using the form above"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
