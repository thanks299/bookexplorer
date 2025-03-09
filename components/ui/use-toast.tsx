"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

export type ToastProps = {
  id?: string
  title?: string
  description?: string
  duration?: number
}

type ToastContextType = {
  toasts: ToastProps[]
  addToast: (toast: ToastProps) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = useCallback((toast: ToastProps) => {
    const id = toast.id || `toast-${Math.random().toString(36).substring(2, 9)}`
    const newToast = { ...toast, id }

    setToasts((prev) => [...prev, newToast])

    if (toast.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, toast.duration || 3000)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: (props: ToastProps) => context.addToast(props),
    dismiss: (id: string) => context.removeToast(id),
    toasts: context.toasts,
  }
}

// For backwards compatibility and ease of use
export const toast = (props: ToastProps) => {
  // This is just a placeholder that will be replaced at runtime
  // The actual implementation will come from the useToast hook
  console.warn("toast() was called outside of a component. Use the useToast() hook instead.")
}

