import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader2 className={`h-${size} w-${size} animate-spin text-primary`} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

