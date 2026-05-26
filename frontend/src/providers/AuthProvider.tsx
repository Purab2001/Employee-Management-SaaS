import { useEffect, useState, type ReactNode } from "react"
import { AuthContext, type User } from "@/contexts/AuthContext"
import {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
  getCurrentUser,
} from "@/services/authService"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false))
  }, [])

  const register = async (name: string, email: string, password: string) => {
    const { user: u } = await registerUser(name, email, password)
    setUser(u)
  }

  const login = async (email: string, password: string) => {
    const { user: u } = await loginUser(email, password)
    setUser(u)
  }

  const googleLogin = async () => {
    const { user: u } = await loginWithGoogle()
    setUser(u)
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
