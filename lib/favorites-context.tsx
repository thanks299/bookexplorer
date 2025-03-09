"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Book } from "./types"
import { useAuth } from "./auth-context"
import { useToast } from "@/components/ui/use-toast"

interface FavoritesContextType {
  favorites: Book[]
  addToFavorites: (book: Book) => Promise<void>
  removeFromFavorites: (bookId: string) => Promise<void>
  isFavorite: (bookId: string) => boolean
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: () => false,
  loading: true,
})

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Load favorites from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites-${user.id}`)
      if (storedFavorites) {
        try {
          setFavorites(JSON.parse(storedFavorites))
        } catch (error) {
          console.error("Error parsing favorites:", error)
          setFavorites([])
        }
      }
    } else {
      setFavorites([])
    }
    setLoading(false)
  }, [user])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user && !loading) {
      localStorage.setItem(`favorites-${user.id}`, JSON.stringify(favorites))
    }
  }, [favorites, user, loading])

  const addToFavorites = async (book: Book) => {
    if (!user) return

    try {
      // Call server action to add to favorites (for database storage in production)
      // In a real app, you would use a server action here
      // const result = await addToFavoritesAction(book)

      setFavorites((prevFavorites) => {
        // Check if book is already in favorites
        if (prevFavorites.some((fav) => fav.id === book.id)) {
          return prevFavorites
        }
        return [...prevFavorites, book]
      })

      // Show success toast
      toast({
        title: "Added to favorites",
        description: `${book.title} has been added to your favorites.`,
      })
    } catch (error) {
      console.error("Error adding to favorites:", error)
      toast({
        title: "Error",
        description: "Failed to add book to favorites. Please try again.",
      })
    }
  }

  const removeFromFavorites = async (bookId: string) => {
    if (!user) return

    try {
      // Call server action to remove from favorites
      // In a real app, you would use a server action here
      // const result = await removeFromFavoritesAction(bookId)

      // Find the book title before removing it
      const bookToRemove = favorites.find((book) => book.id === bookId)
      const bookTitle = bookToRemove?.title || "Book"

      setFavorites((prevFavorites) => prevFavorites.filter((book) => book.id !== bookId))

      // Show success toast
      toast({
        title: "Removed from favorites",
        description: `${bookTitle} has been removed from your favorites.`,
      })
    } catch (error) {
      console.error("Error removing from favorites:", error)
      toast({
        title: "Error",
        description: "Failed to remove book from favorites. Please try again.",
      })
    }
  }

  const isFavorite = (bookId: string) => {
    return favorites.some((book) => book.id === bookId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)

