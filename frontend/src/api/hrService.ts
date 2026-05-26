import api from "@/api/axios"

export interface Employee {
  _id: string
  firebaseUid: string
  name: string
  email: string
  photoURL: string
  role: "employee"
  designation: string
  salary: number
  bank_account_no: string
  isVerified: boolean
  status: "active" | "fired"
  createdAt: string
}

export interface EmployeeDetailsResponse {
  employee: Employee
  stats: {
    totalWorkHours: number
    totalPayments: number
  }
}

export interface PaymentRecord {
  _id: string
  employeeEmail: string
  month: string
  year: number
  amount: number
  transactionId: string
  paymentDate: string
}

export interface WorkLogEntry {
  _id: string
  employeeEmail: string
  task: string
  hours: number
  date: string
  createdAt: string
}

export interface ProgressResponse {
  entries: WorkLogEntry[]
  totalHours: number
}

export async function getEmployees(): Promise<Employee[]> {
  const { data } = await api.get<Employee[]>("/api/hr/employees")
  return data
}

export async function getEmployeeById(id: string): Promise<EmployeeDetailsResponse> {
  const { data } = await api.get<EmployeeDetailsResponse>(`/api/hr/employees/${id}`)
  return data
}

export async function verifyEmployee(id: string): Promise<{ message: string; employee: Employee }> {
  const { data } = await api.patch(`/api/hr/employees/${id}/verify`)
  return data
}

export async function payEmployee(
  id: string,
  payload: { month: string; year: number; amount: number }
): Promise<{ message: string; payment: PaymentRecord }> {
  const { data } = await api.post(`/api/hr/employees/${id}/pay`, payload)
  return data
}

export async function getEmployeePayments(id: string): Promise<PaymentRecord[]> {
  const { data } = await api.get<PaymentRecord[]>(`/api/hr/employees/${id}/payments`)
  return data
}

export async function getProgress(
  filters?: { employeeEmail?: string; month?: string; year?: number }
): Promise<ProgressResponse> {
  const params = new URLSearchParams()
  if (filters?.employeeEmail) params.set("employeeEmail", filters.employeeEmail)
  if (filters?.month) params.set("month", filters.month)
  if (filters?.year) params.set("year", String(filters.year))

  const qs = params.toString()
  const { data } = await api.get<ProgressResponse>(`/api/hr/progress${qs ? `?${qs}` : ""}`)
  return data
}
