"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AlertCircle, BookOpen, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface BookReaderProps {
  bookId: string
  title: string
  previewUrl?: string | null
  coverImage?: string
  content?: string
}

export function BookReader({ bookId, title, previewUrl, coverImage, content }: BookReaderProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10 // This would be dynamic in a real implementation

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setError("Failed to load book content. Please try again later.")
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  // If user is not authenticated, show preview or sign-in prompt
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border p-6 bg-muted/30">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Full Access Restricted</h3>
          </div>
          <p className="text-center text-muted-foreground mb-4">
            Sign in to read the full book. Preview is available below.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => router.push("/auth/signin")}>Sign In to Read</Button>
          </div>
        </div>

        {previewUrl ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Book Preview</h3>
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size={8} />
              </div>
            )}

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

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                This is a limited preview. Sign in to read the full book.
              </p>
              <Button onClick={() => router.push("/auth/signin")}>Sign In to Read Full Book</Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">No preview available</h2>
            <p className="mt-2 text-muted-foreground">Sign in to read the full book.</p>
            <Button className="mt-4" onClick={() => router.push("/auth/signin")}>
              Sign In
            </Button>
          </div>
        )}
      </div>
    )
  }

  // For authenticated users, show the full book reader
  return (
    <div className="space-y-6">
      <div className="rounded-lg border overflow-hidden">
        <div className="bg-primary/10 p-4 flex items-center justify-between">
          <h3 className="font-semibold">Reading: {title}</h3>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {isLoading && !error && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size={8} />
          </div>
        )}

        {error ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
            <h3 className="mt-2 font-semibold text-destructive">Error Loading Book</h3>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="p-6 min-h-[500px] prose dark:prose-invert max-w-none">
            {/* If we have a preview URL, use it */}
            {previewUrl ? (
              <div className={isLoading ? "hidden" : ""}>
                <iframe
                  src={previewUrl}
                  title={`Reading ${title}`}
                  width="100%"
                  height="600"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  className="rounded-lg border"
                />
              </div>
            ) : (
              /* Otherwise, show a mock book content */
              <div className="flex flex-col md:flex-row gap-6">
                {coverImage && (
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <div className="relative w-[150px] h-[225px] rounded-md overflow-hidden shadow-lg">
                      <Image src={coverImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
                    </div>
                  </div>
                )}
                <div>
                  <h2>Chapter {currentPage}</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                    magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
                    quia dolor sit amet, consectetur, adipisci velit.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-muted/30 p-4 flex items-center justify-between">
          <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1 || !!previewUrl}>
            Previous Page
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages || !!previewUrl}>
            Next Page
          </Button>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => addToLibraryAction(bookId)}>
          <BookOpen className="mr-2 h-4 w-4" />
          Add to Library
        </Button>
        <Button>Continue Reading Later</Button>
      </div>
    </div>
  )
}

// Mock function for adding to library
function addToLibraryAction(bookId: string) {
  // In a real app, this would be a server action
  const savedBooks = JSON.parse(localStorage.getItem("savedBooks") || "[]")
  if (!savedBooks.includes(bookId)) {
    savedBooks.push(bookId)
    localStorage.setItem("savedBooks", JSON.stringify(savedBooks))
  }
  alert(`Book added to your library!`)
}

