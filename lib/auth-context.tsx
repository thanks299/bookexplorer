"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  id: string
  name: string
  email: string
  image?: string
}

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string) => Promise<boolean>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: async () => false,
  signUp: async () => false,
  signOut: () => {},
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Mock sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, this would call an API
      // For demo purposes, we'll accept any email/password
      if (email && password) {
        const mockUser: User = {
          id: "1",
          name: email.split("@")[0],
          email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Sign in error:", error)
      return false
    }
  }

  // Mock sign up function
  const signUp = async (name: string, email: string, password: string) => {
    try {
      // In a real app, this would call an API
      if (name && email && password) {
        const mockUser: User = {
          id: "1",
          name,
          email,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Sign up error:", error)
      return false
    }
  }

  // Sign out function
  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

