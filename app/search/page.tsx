import { BookSearch } from "@/components/book-search"
import { searchBooksAction } from "../actions"

interface SearchPageProps {
  searchParams: { q?: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""
  const { books, error } = await searchBooksAction(query)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <BookSearch initialBooks={books} initialQuery={query} />
        {error && <p className="text-destructive mt-4">{error}</p>}
      </div>
    </main>
  )
}

