export interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  rating: number
  categories: string[]
  publishedDate: string
  publisher: string
  language: string
  source: string
  previewLink?: string | null
}

export interface SearchFilters {
  source?: string
  category?: string
  minRating?: number
  hasPreview?: boolean
  language?: string
}

