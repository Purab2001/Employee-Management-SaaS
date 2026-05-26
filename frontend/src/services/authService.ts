import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { auth, googleProvider } from "@/config/firebase"
import api from "@/api/axios"
import type { User } from "@/contexts/AuthContext"

interface AuthResponse {
  token: string
  user: User
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  const idToken = await credential.user.getIdToken()

  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    idToken,
    name,
  })

  localStorage.setItem("token", data.token)
  return data
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const idToken = await credential.user.getIdToken()

  const { data } = await api.post<AuthResponse>("/api/auth/login", { idToken })

  localStorage.setItem("token", data.token)
  return data
}

export async function loginWithGoogle(): Promise<AuthResponse> {
  const credential = await signInWithPopup(auth, googleProvider)
  const idToken = await credential.user.getIdToken()

  const { data } = await api.post<AuthResponse>("/api/auth/login", { idToken })

  localStorage.setItem("token", data.token)
  return data
}

export async function logoutUser(): Promise<void> {
  try {
    await api.post("/api/auth/logout")
  } finally {
    localStorage.removeItem("token")
    await signOut(auth)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<{ user: User }>("/api/auth/me")
    return data.user
  } catch {
    return null
  }
}
