import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Globe, Library, Search } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About BookExplorer</h1>
          <p className="text-muted-foreground">Your one-stop platform for book discovery and exploration</p>
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <p>
            BookExplorer is a comprehensive book search platform that integrates multiple book APIs, allowing users to
            search, discover, and read books seamlessly. Our mission is to make book discovery easy and enjoyable for
            everyone.
          </p>

          <h2>Our Story</h2>
          <p>
            Founded in 2023, BookExplorer was created by a team of book lovers and technology enthusiasts who wanted to
            build a better way to discover new books. We were frustrated with having to search multiple platforms to
            find comprehensive information about books, so we decided to create a solution that brings everything
            together in one place.
          </p>

          <h2>What We Offer</h2>
          <div className="grid gap-6 sm:grid-cols-2 not-prose">
            <div className="rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-2 font-semibold">Powerful Search</h3>
              <p className="text-sm text-muted-foreground">
                Search millions of books by title, author, genre, and more.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="mt-2 font-semibold">Multiple Sources</h3>
              <p className="text-sm text-muted-foreground">
                Access data from Google Books, Open Library, Goodreads, and more.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mt-2 font-semibold">Book Previews</h3>
              <p className="text-sm text-muted-foreground">
                Read excerpts and previews before deciding on your next book.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Library className="h-6 w-6" />
              </div>
              <h3 className="mt-2 font-semibold">Personal Library</h3>
              <p className="text-sm text-muted-foreground">Save your favorite books and create reading lists.</p>
            </div>
          </div>

          <h2>Our Technology</h2>
          <p>
            BookExplorer is built using modern web technologies to ensure a fast, responsive, and accessible experience
            for all users. We use Next.js for server-side rendering, Tailwind CSS for responsive design, and integrate
            with multiple book APIs to provide comprehensive data.
          </p>

          <h2>Contact Us</h2>
          <p>
            We'd love to hear from you! If you have any questions, suggestions, or feedback, please don't hesitate to
            reach out.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/browse">Start Exploring</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

