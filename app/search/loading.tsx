import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner size={8} />
    </div>
  )
}

