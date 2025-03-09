"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-background border rounded-lg shadow-lg p-4 flex items-start gap-3 animate-in slide-in-from-right"
        >
          <div className="flex-1">
            {toast.title && <h3 className="font-semibold">{toast.title}</h3>}
            {toast.description && <p className="text-sm text-muted-foreground">{toast.description}</p>}
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => dismiss(toast.id!)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      ))}
    </div>
  )
}

