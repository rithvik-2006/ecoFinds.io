"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
  username: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username: string) => Promise<void>
  signOut: () => void
  updateProfile: (username: string) => Promise<void>
}

// Mock data for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    username: "ecouser",
  },
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem("ecofinds_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate API call
      const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        throw new Error("Invalid credentials")
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("ecofinds_user", JSON.stringify(userWithoutPassword))

      toast({
        title: "Login successful",
        description: "Welcome back to EcoFinds!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true)
    try {
      // Simulate API call
      if (MOCK_USERS.some((u) => u.email === email)) {
        throw new Error("Email already in use")
      }

      const newUser = {
        id: String(MOCK_USERS.length + 1),
        email,
        password,
        username,
      }

      MOCK_USERS.push(newUser)

      const { password: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)
      localStorage.setItem("ecofinds_user", JSON.stringify(userWithoutPassword))

      toast({
        title: "Account created",
        description: "Welcome to EcoFinds!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("ecofinds_user")
    router.push("/")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateProfile = async (username: string) => {
    if (!user) return

    try {
      // Simulate API call
      const updatedUser = { ...user, username }
      setUser(updatedUser)
      localStorage.setItem("ecofinds_user", JSON.stringify(updatedUser))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Failed to update profile.",
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
