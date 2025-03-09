"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookCard } from "@/components/book-card"
import { BookGrid } from "@/components/book-grid"
import { Search, Filter, Loader2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Book, SearchFilters } from "@/lib/types"
import { searchBooksAction } from "@/app/actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { AnimatedText } from "@/components/ui/animated-text"

interface BookSearchProps {
  initialBooks?: Book[]
  initialQuery?: string
}

export function BookSearch({ initialBooks = [], initialQuery = "" }: BookSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialQuery || searchParams.get("q") || "")
  const [books, setBooks] = useState<Book[]>(initialBooks)
  const [view, setView] = useState("grid")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilters>({
    source: searchParams.get("source") || "all",
    category: searchParams.get("category") || "all",
    minRating: searchParams.get("rating") ? Number(searchParams.get("rating")) : 0,
    hasPreview: searchParams.get("preview") === "true",
  })

  // Add these new state variables after the existing state declarations
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Update URL with search parameters
  const updateSearchParams = (query: string, filters: SearchFilters) => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (filters.source && filters.source !== "all") params.set("source", filters.source)
    if (filters.category && filters.category !== "all") params.set("category", filters.category)
    if (filters.minRating && filters.minRating > 0) params.set("rating", filters.minRating.toString())
    if (filters.hasPreview) params.set("preview", "true")

    // Update URL without refreshing the page
    const url = `/search?${params.toString()}`
    router.push(url, { scroll: false })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setError(null)
    startTransition(async () => {
      try {
        updateSearchParams(searchQuery, filters)
        const result = await searchBooksAction(searchQuery, filters)
        if (result.error) {
          setError(result.error)
        } else {
          setBooks(result.books)
        }
      } catch (error) {
        setError("An error occurred while searching. Please try again.")
        console.error("Search error:", error)
      }
    })
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    if (!searchQuery.trim()) return

    setError(null)
    startTransition(async () => {
      try {
        updateSearchParams(searchQuery, filters)
        const result = await searchBooksAction(searchQuery, filters)
        if (result.error) {
          setError(result.error)
        } else {
          setBooks(result.books)
        }
      } catch (error) {
        setError("An error occurred while applying filters. Please try again.")
        console.error("Filter error:", error)
      }
    })
  }

  // Load search results if URL has search params but no initial books
  useEffect(() => {
    const query = searchParams.get("q")
    if (query && initialBooks.length === 0 && !isPending) {
      setSearchQuery(query)
      startTransition(async () => {
        try {
          const result = await searchBooksAction(query, filters)
          if (result.error) {
            setError(result.error)
          } else {
            setBooks(result.books)
          }
        } catch (error) {
          setError("An error occurred while searching. Please try again.")
          console.error("Search error:", error)
        }
      })
    }
  }, [searchParams, initialBooks.length, filters, isPending])

  // Replace the existing "Load More" button with this implementation
  const loadMore = () => {
    if (!searchQuery.trim() || !hasMore) return

    const nextPage = page + 1
    setPage(nextPage)

    setError(null)
    startTransition(async () => {
      try {
        const result = await searchBooksAction(searchQuery, filters, nextPage)
        if (result.error) {
          setError(result.error)
        } else if (result.books.length === 0) {
          setHasMore(false)
        } else {
          setBooks((prevBooks) => [...prevBooks, ...result.books])
        }
      } catch (error) {
        setError("An error occurred while loading more books. Please try again.")
        console.error("Load more error:", error)
      }
    })
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatedText
          text={searchQuery ? `Search Results for "${searchQuery}"` : "Popular Books"}
          as="h2"
          className="text-2xl font-bold tracking-tight"
        />
        <div className="flex items-center gap-2">
          <motion.form
            onSubmit={handleSearch}
            className="relative flex-1 sm:w-[300px]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              className="absolute right-0 top-0 h-full px-3"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </motion.form>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Books</SheetTitle>
                  <SheetDescription>Narrow down your search with these filters.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={filters.category || "all"}
                      onValueChange={(value) => handleFilterChange("category", value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-Fiction</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="biography">Biography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="source">Source</Label>
                    <Select
                      value={filters.source || "all"}
                      onValueChange={(value) => handleFilterChange("source", value)}
                    >
                      <SelectTrigger id="source">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="google">Google Books</SelectItem>
                        <SelectItem value="open-library">Open Library</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Rating</Label>
                    <Slider
                      defaultValue={[filters.minRating || 0]}
                      max={5}
                      step={0.5}
                      onValueChange={(value) => handleFilterChange("minRating", value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Any</span>
                      <span>5 Stars</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="preview"
                          checked={filters.hasPreview}
                          onCheckedChange={(checked) => handleFilterChange("hasPreview", checked === true)}
                        />
                        <Label htmlFor="preview" className="text-sm font-normal">
                          Preview Available
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button onClick={applyFilters} disabled={isPending}>
                      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Apply Filters
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden sm:block"
          >
            <Tabs defaultValue="grid" className="hidden sm:block" onValueChange={(value) => setView(value)}>
              <TabsList className="grid w-[120px] grid-cols-2">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPending ? (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="sr-only">Loading...</span>
          </motion.div>
        ) : books.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {view === "grid" ? (
              <BookGrid books={books} />
            ) : (
              <div className="space-y-4">
                {books.map((book, index) => (
                  <BookCard key={book.id} book={book} layout="list" index={index} />
                ))}
              </div>
            )}

            {/* Replace the existing "Load More" button in the JSX with this */}
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="outline" disabled={isPending || !hasMore} onClick={loadMore}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : !hasMore ? (
                  "No More Books"
                ) : (
                  "Load More"
                )}
              </Button>
            </motion.div>
          </motion.div>
        ) : searchQuery ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-muted-foreground">No books found for "{searchQuery}"</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search term or adjust your filters</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

