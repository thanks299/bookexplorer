"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AlertCircle, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface BookPreviewProps {
  previewUrl: string | null | undefined
  title: string
}

export function BookPreview({ previewUrl, title }: BookPreviewProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError("Failed to load preview. Please try opening the preview in a new tab.")
  }

  if (!previewUrl) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No preview available</h2>
        <p className="mt-2 text-muted-foreground">
          {user
            ? "This book doesn't have a preview available, but you can read the full book."
            : "This book doesn't have a preview available. Sign in to read the full book."}
        </p>
        {!user && (
          <Button className="mt-4" onClick={() => router.push("/auth/signin")}>
            Sign In to Read
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {!user && (
        <div className="rounded-lg border p-4 bg-muted/30">
          <p className="text-center text-muted-foreground">
            This is a limited preview.{" "}
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/signin")}>
              Sign in
            </Button>{" "}
            to read the full book.
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size={8} />
        </div>
      )}

      {error ? (
        <div className="rounded-lg border border-destructive p-4 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="mt-2 font-semibold text-destructive">Error Loading Preview</h3>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-4" asChild>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
              Open Preview in New Tab
            </a>
          </Button>
        </div>
      ) : (
        <div className={isLoading ? "hidden" : ""}>
          <iframe
            src={previewUrl}
            title={`Preview of ${title}`}
            width="100%"
            height="500"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="rounded-lg border"
          />
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Button asChild>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            Open Preview in New Tab
          </a>
        </Button>

        {!user && (
          <Button variant="outline" onClick={() => router.push("/auth/signin")}>
            Sign In to Read Full Book
          </Button>
        )}
      </div>
    </div>
  )
}

