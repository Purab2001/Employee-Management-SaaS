import api from "@/api/axios"

export interface WorkSheetEntry {
  _id: string
  employeeEmail: string
  task: string
  hours: number
  date: string
  createdAt: string
}

export interface CreateWorkSheetData {
  task: string
  hours: number
  date: string
}

export type UpdateWorkSheetData = Partial<CreateWorkSheetData>

export async function getWorkSheets(): Promise<WorkSheetEntry[]> {
  const { data } = await api.get<WorkSheetEntry[]>("/api/worksheets")
  return data
}

export async function createWorkSheet(
  input: CreateWorkSheetData,
): Promise<WorkSheetEntry> {
  const { data } = await api.post<WorkSheetEntry>("/api/worksheets", input)
  return data
}

export async function updateWorkSheet(
  id: string,
  input: UpdateWorkSheetData,
): Promise<WorkSheetEntry> {
  const { data } = await api.put<WorkSheetEntry>(
    `/api/worksheets/${id}`,
    input,
  )
  return data
}

export async function deleteWorkSheet(id: string): Promise<void> {
  await api.delete(`/api/worksheets/${id}`)
}

export interface Payment {
  _id: string
  employeeEmail: string
  month: string
  year: number
  amount: number
  transactionId: string
  paymentDate: string
}

export interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export async function getPayments(
  page = 1,
  limit = 10,
): Promise<PaymentsResponse> {
  const { data } = await api.get<PaymentsResponse>(
    `/api/payments?page=${page}&limit=${limit}`,
  )
  return data
}
