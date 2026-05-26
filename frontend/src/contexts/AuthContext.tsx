import { createContext } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "employee" | "hr" | "admin"
  photoURL: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  register: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
