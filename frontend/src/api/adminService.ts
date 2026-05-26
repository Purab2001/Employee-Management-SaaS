import api from "@/api/axios"

export interface AdminEmployee {
  _id: string
  firebaseUid: string
  name: string
  email: string
  photoURL: string
  role: "employee" | "hr" | "admin"
  designation: string
  salary: number
  bank_account_no: string
  isVerified: boolean
  status: "active" | "fired"
  createdAt: string
}

export interface PayrollRecord {
  _id: string
  employeeId: {
    _id: string
    name: string
    email: string
  }
  employeeEmail: string
  salary: number
  month: string
  year: number
  paymentDate: string | null
  transactionId: string
  paid: boolean
  createdAt: string
}

export async function getAllEmployees(): Promise<AdminEmployee[]> {
  const { data } = await api.get<AdminEmployee[]>("/api/admin/employees")
  return data
}

export async function promoteToHR(
  id: string
): Promise<{ message: string; user: AdminEmployee }> {
  const { data } = await api.patch(`/api/admin/employees/${id}/promote`)
  return data
}

export async function fireEmployee(
  id: string
): Promise<{ message: string; user: AdminEmployee }> {
  const { data } = await api.patch(`/api/admin/employees/${id}/fire`)
  return data
}

export async function updateSalary(
  id: string,
  salary: number
): Promise<{ message: string; user: AdminEmployee }> {
  const { data } = await api.patch(`/api/admin/employees/${id}/salary`, { salary })
  return data
}

export async function getPayrolls(): Promise<PayrollRecord[]> {
  const { data } = await api.get<PayrollRecord[]>("/api/admin/payrolls")
  return data
}

export async function approvePayroll(payload: {
  employeeId: string
  month: string
  year: number
}): Promise<{ message: string; payroll: PayrollRecord }> {
  const { data } = await api.post("/api/admin/payrolls", payload)
  return data
}

export async function createPaymentSession(
  payrollId: string
): Promise<{ url: string }> {
  const { data } = await api.post<{ url: string }>("/api/payments/create-checkout-session", { payrollId })
  return data
}
