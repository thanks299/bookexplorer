import { BookSearch } from "@/components/book-search"
import { Hero } from "@/components/hero"
import { getPopularBooksAction } from "./actions"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default async function Home() {
  const { books, error } = await getPopularBooksAction(10)

  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <ScrollReveal>
          <BookSearch initialBooks={books} />
          {error && <p className="text-destructive mt-4">{error}</p>}
        </ScrollReveal>
      </div>
    </main>
  )
}

