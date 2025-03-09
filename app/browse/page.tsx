import { BookSearch } from "@/components/book-search"
import { getPopularBooksAction } from "@/app/actions"

export default async function BrowsePage() {
  const { books, error } = await getPopularBooksAction(20)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Books</h1>
          <p className="text-muted-foreground">Discover millions of books from multiple sources</p>
        </div>
        <BookSearch initialBooks={books} />
        {error && <p className="text-destructive mt-4">{error}</p>}
      </div>
    </main>
  )
}

