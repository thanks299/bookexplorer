"use server"

import { searchBooks, getBookById, getSimilarBooks, getPopularBooks, getBooksByCategory } from "@/lib/api"
import type { Book, SearchFilters } from "@/lib/types"
import { revalidatePath } from "next/cache"

// Update the searchBooksAction function to support pagination
export async function searchBooksAction(
  query: string,
  filters: SearchFilters = {},
  page = 1,
): Promise<{ books: Book[]; error: string | null }> {
  try {
    if (!query) {
      return { books: [], error: null }
    }

    // Calculate offset based on page (assuming 20 items per page)
    const offset = (page - 1) * 20

    const books = await searchBooks(query, filters, offset)
    return { books, error: null }
  } catch (error) {
    console.error("Error in searchBooksAction:", error)
    return {
      books: [],
      error: "Failed to search books. Please try again later.",
    }
  }
}

export async function getBookByIdAction(id: string): Promise<{ book: Book | null; error: string | null }> {
  try {
    if (!id) {
      return { book: null, error: "Book ID is required" }
    }

    const book = await getBookById(id)
    return { book, error: null }
  } catch (error) {
    console.error("Error in getBookByIdAction:", error)
    return {
      book: null,
      error: "Failed to fetch book details. Please try again later.",
    }
  }
}

export async function getSimilarBooksAction(book: Book, limit = 4): Promise<{ books: Book[]; error: string | null }> {
  try {
    const books = await getSimilarBooks(book, limit)
    return { books, error: null }
  } catch (error) {
    console.error("Error in getSimilarBooksAction:", error)
    return {
      books: [],
      error: "Failed to fetch similar books. Please try again later.",
    }
  }
}

export async function getPopularBooksAction(limit = 10): Promise<{ books: Book[]; error: string | null }> {
  try {
    const books = await getPopularBooks(limit)
    return { books, error: null }
  } catch (error) {
    console.error("Error in getPopularBooksAction:", error)
    return {
      books: [],
      error: "Failed to fetch popular books. Please try again later.",
    }
  }
}

export async function getBooksByCategoryAction(
  category: string,
  limit = 20,
): Promise<{ books: Book[]; error: string | null }> {
  try {
    if (!category) {
      return { books: [], error: "Category is required" }
    }

    const books = await getBooksByCategory(category, limit)
    return { books, error: null }
  } catch (error) {
    console.error("Error in getBooksByCategoryAction:", error)
    return {
      books: [],
      error: "Failed to fetch books by category. Please try again later.",
    }
  }
}

// Add to favorites action (for server-side favorites management)
export async function addToFavoritesAction(book: Book): Promise<{ success: boolean; error: string | null }> {
  try {
    // In a real app, this would store the favorite in a database
    // For now, we'll just return success
    console.log("Adding to favorites:", book.id)

    // Revalidate the favorites page to show updated content
    revalidatePath("/favorites")

    return { success: true, error: null }
  } catch (error) {
    console.error("Error adding to favorites:", error)
    return { success: false, error: "Failed to add book to favorites" }
  }
}

// Remove from favorites action
export async function removeFromFavoritesAction(bookId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    // In a real app, this would remove the favorite from a database
    console.log("Removing from favorites:", bookId)

    // Revalidate the favorites page to show updated content
    revalidatePath("/favorites")

    return { success: true, error: null }
  } catch (error) {
    console.error("Error removing from favorites:", error)
    return { success: false, error: "Failed to remove book from favorites" }
  }
}

