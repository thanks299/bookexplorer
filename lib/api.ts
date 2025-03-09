import type { Book, SearchFilters } from "./types"

// API endpoints
const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
const OPEN_LIBRARY_API = "https://openlibrary.org/search.json"

// Helper function to handle API errors
async function handleApiResponse(response: Response, apiName: string) {
  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error")
    console.error(`${apiName} API error (${response.status}): ${errorText}`)
    throw new Error(`${apiName} API error: ${response.status}`)
  }
  return response.json()
}

// Update the fetchGoogleBooks function to support pagination
export async function fetchGoogleBooks(query: string, maxResults = 20, startIndex = 0): Promise<Book[]> {
  try {
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${maxResults}&startIndex=${startIndex}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    const data = await handleApiResponse(response, "Google Books")

    if (!data.items || !Array.isArray(data.items)) {
      return []
    }

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unknown Author",
      description: item.volumeInfo.description || "No description available",
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=450&width=300",
      rating: item.volumeInfo.averageRating || 0,
      categories: item.volumeInfo.categories || [],
      publishedDate: item.volumeInfo.publishedDate || "Unknown",
      publisher: item.volumeInfo.publisher || "Unknown Publisher",
      language: item.volumeInfo.language || "Unknown",
      source: "Google Books",
      previewLink: item.volumeInfo.previewLink || null,
    }))
  } catch (error) {
    console.error("Error fetching from Google Books:", error)
    throw error
  }
}

// Update the fetchOpenLibraryBooks function to support pagination
export async function fetchOpenLibraryBooks(query: string, limit = 20, offset = 0): Promise<Book[]> {
  try {
    const response = await fetch(
      `${OPEN_LIBRARY_API}?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    const data = await handleApiResponse(response, "Open Library")

    if (!data.docs || !Array.isArray(data.docs)) {
      return []
    }

    return data.docs.map((item: any) => ({
      id: `ol_${item.key}`.replace(/\//g, "_"),
      title: item.title || "Unknown Title",
      author: item.author_name ? item.author_name.join(", ") : "Unknown Author",
      description: item.description || "No description available",
      coverImage: item.cover_i
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
        : "/placeholder.svg?height=450&width=300",
      rating: 0, // Open Library doesn't provide ratings
      categories: item.subject || [],
      publishedDate: item.first_publish_year?.toString() || "Unknown",
      publisher: item.publisher ? item.publisher[0] : "Unknown Publisher",
      language: item.language ? item.language[0] : "Unknown",
      source: "Open Library",
      previewLink: item.key ? `https://openlibrary.org${item.key}` : null,
    }))
  } catch (error) {
    console.error("Error fetching from Open Library:", error)
    throw error
  }
}

// Update the searchBooks function to support pagination with offset
export async function searchBooks(query: string, filters: SearchFilters = {}, offset = 0): Promise<Book[]> {
  if (!query) {
    return []
  }

  try {
    // Determine which APIs to query based on filters
    const promises: Promise<Book[]>[] = []
    const limit = 20 // Items per page

    if (!filters.source || filters.source === "all" || filters.source === "google") {
      promises.push(fetchGoogleBooks(query, limit, offset))
    }

    if (!filters.source || filters.source === "all" || filters.source === "open-library") {
      promises.push(fetchOpenLibraryBooks(query, limit, offset))
    }

    // Wait for all API calls to complete
    const results = await Promise.allSettled(promises)

    // Combine successful results
    let combinedResults: Book[] = []

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        combinedResults = [...combinedResults, ...result.value]
      }
    })

    // Apply filters
    if (filters.category && filters.category !== "all") {
      combinedResults = combinedResults.filter((book) =>
        book.categories.some((category) => category.toLowerCase().includes(filters.category!.toLowerCase())),
      )
    }

    if (filters.minRating && filters.minRating > 0) {
      combinedResults = combinedResults.filter((book) => book.rating >= filters.minRating!)
    }

    if (filters.hasPreview) {
      combinedResults = combinedResults.filter((book) => book.previewLink !== null)
    }

    return combinedResults
  } catch (error) {
    console.error("Error searching books:", error)
    throw error
  }
}

// Get book details by ID
export async function getBookById(id: string): Promise<Book | null> {
  try {
    // Check if it's an Open Library ID
    if (id.startsWith("ol_")) {
      const olKey = id.replace("ol_", "").replace(/_/g, "/")
      const response = await fetch(`https://openlibrary.org${olKey}.json`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
      })

      const data = await handleApiResponse(response, "Open Library")

      // Fetch author information
      let authorName = "Unknown Author"
      if (data.authors && data.authors[0]?.key) {
        try {
          const authorResponse = await fetch(`https://openlibrary.org${data.authors[0].key}.json`, {
            next: { revalidate: 86400 }, // Cache for 24 hours
          })
          if (authorResponse.ok) {
            const authorData = await authorResponse.json()
            authorName = authorData.name || "Unknown Author"
          }
        } catch (authorError) {
          console.error("Error fetching author details:", authorError)
        }
      }

      return {
        id,
        title: data.title || "Unknown Title",
        author: authorName,
        description: data.description?.value || data.description || "No description available",
        coverImage: data.covers?.[0]
          ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
          : "/placeholder.svg?height=450&width=300",
        rating: 0,
        categories: data.subjects || [],
        publishedDate: data.publish_date || "Unknown",
        publisher: data.publishers?.[0] || "Unknown Publisher",
        language: data.languages?.[0]?.key?.replace("/languages/", "") || "Unknown",
        source: "Open Library",
        previewLink: `https://openlibrary.org${olKey}`,
      }
    } else {
      // Assume it's a Google Books ID
      const response = await fetch(`${GOOGLE_BOOKS_API}/${id}`, {
        next: { revalidate: 86400 }, // Cache for 24 hours
      })

      const item = await handleApiResponse(response, "Google Books")

      return {
        id: item.id,
        title: item.volumeInfo.title || "Unknown Title",
        author: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unknown Author",
        description: item.volumeInfo.description || "No description available",
        coverImage: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=450&width=300",
        rating: item.volumeInfo.averageRating || 0,
        categories: item.volumeInfo.categories || [],
        publishedDate: item.volumeInfo.publishedDate || "Unknown",
        publisher: item.volumeInfo.publisher || "Unknown Publisher",
        language: item.volumeInfo.language || "Unknown",
        source: "Google Books",
        previewLink: item.volumeInfo.previewLink || null,
      }
    }
  } catch (error) {
    console.error("Error fetching book details:", error)
    return null
  }
}

// Get similar books based on a book's categories
export async function getSimilarBooks(book: Book, limit = 4): Promise<Book[]> {
  try {
    if (!book.categories || book.categories.length === 0) {
      return []
    }

    // Use the first category to find similar books
    const category = book.categories[0]
    const query = `subject:${category}`

    if (book.source === "Google Books") {
      const response = await fetch(
        `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=${limit + 1}`,
        { next: { revalidate: 3600 } }, // Cache for 1 hour
      )

      const data = await handleApiResponse(response, "Google Books")

      if (!data.items || !Array.isArray(data.items)) {
        return []
      }

      // Filter out the original book
      return data.items
        .filter((item: any) => item.id !== book.id)
        .map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title || "Unknown Title",
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unknown Author",
          description: item.volumeInfo.description || "No description available",
          coverImage: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=450&width=300",
          rating: item.volumeInfo.averageRating || 0,
          categories: item.volumeInfo.categories || [],
          publishedDate: item.volumeInfo.publishedDate || "Unknown",
          publisher: item.volumeInfo.publisher || "Unknown Publisher",
          language: item.volumeInfo.language || "Unknown",
          source: "Google Books",
          previewLink: item.volumeInfo.previewLink || null,
        }))
        .slice(0, limit)
    } else {
      // Open Library
      const response = await fetch(
        `${OPEN_LIBRARY_API}?q=${encodeURIComponent(category)}&limit=${limit + 1}`,
        { next: { revalidate: 3600 } }, // Cache for 1 hour
      )

      const data = await handleApiResponse(response, "Open Library")

      if (!data.docs || !Array.isArray(data.docs)) {
        return []
      }

      // Filter out the original book and map to our Book type
      return data.docs
        .filter((item: any) => `ol_${item.key}`.replace(/\//g, "_") !== book.id)
        .map((item: any) => ({
          id: `ol_${item.key}`.replace(/\//g, "_"),
          title: item.title || "Unknown Title",
          author: item.author_name ? item.author_name.join(", ") : "Unknown Author",
          description: item.description || "No description available",
          coverImage: item.cover_i
            ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
            : "/placeholder.svg?height=450&width=300",
          rating: 0,
          categories: item.subject || [],
          publishedDate: item.first_publish_year?.toString() || "Unknown",
          publisher: item.publisher ? item.publisher[0] : "Unknown Publisher",
          language: item.language ? item.language[0] : "Unknown",
          source: "Open Library",
          previewLink: item.key ? `https://openlibrary.org${item.key}` : null,
        }))
        .slice(0, limit)
    }
  } catch (error) {
    console.error("Error fetching similar books:", error)
    return []
  }
}

// Get popular books (for homepage)
export async function getPopularBooks(limit = 10): Promise<Book[]> {
  try {
    // For Google Books, we can search for popular books by using a generic query
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=subject:fiction&orderBy=relevance&maxResults=${limit}`,
      { next: { revalidate: 43200 } }, // Cache for 12 hours
    )

    const data = await handleApiResponse(response, "Google Books")

    if (!data.items || !Array.isArray(data.items)) {
      return []
    }

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unknown Author",
      description: item.volumeInfo.description || "No description available",
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=450&width=300",
      rating: item.volumeInfo.averageRating || 0,
      categories: item.volumeInfo.categories || [],
      publishedDate: item.volumeInfo.publishedDate || "Unknown",
      publisher: item.volumeInfo.publisher || "Unknown Publisher",
      language: item.volumeInfo.language || "Unknown",
      source: "Google Books",
      previewLink: item.volumeInfo.previewLink || null,
    }))
  } catch (error) {
    console.error("Error fetching popular books:", error)
    return []
  }
}

// Get books by category
export async function getBooksByCategory(category: string, limit = 20): Promise<Book[]> {
  try {
    // Google Books API allows searching by subject
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=subject:${encodeURIComponent(category)}&maxResults=${limit}`,
      { next: { revalidate: 43200 } }, // Cache for 12 hours
    )

    const data = await handleApiResponse(response, "Google Books")

    if (!data.items || !Array.isArray(data.items)) {
      return []
    }

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.volumeInfo.title || "Unknown Title",
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(", ") : "Unknown Author",
      description: item.volumeInfo.description || "No description available",
      coverImage: item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=450&width=300",
      rating: item.volumeInfo.averageRating || 0,
      categories: item.volumeInfo.categories || [],
      publishedDate: item.volumeInfo.publishedDate || "Unknown",
      publisher: item.volumeInfo.publisher || "Unknown Publisher",
      language: item.volumeInfo.language || "Unknown",
      source: "Google Books",
      previewLink: item.volumeInfo.previewLink || null,
    }))
  } catch (error) {
    console.error("Error fetching books by category:", error)
    return []
  }
}

