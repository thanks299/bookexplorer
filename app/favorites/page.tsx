"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useFavorites } from "@/lib/favorites-context"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book-card"

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth()
  const { favorites, loading: favoritesLoading } = useFavorites()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin")
    }
  }, [user, authLoading, router])

  if (authLoading || favoritesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size={8} />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Favorite Books</h1>
          <p className="text-muted-foreground">Books you've saved to your library</p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {favorites.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Your favorites list is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Start adding books to your favorites by clicking the heart icon on any book.
            </p>
            <Button className="mt-4" asChild>
              <a href="/browse">Browse Books</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

