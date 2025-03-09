import { getBookByIdAction } from "@/app/actions"
import { BookReader } from "@/components/book-reader"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface ReadBookPageProps {
  params: Promise<{ id: string }> | { id: string }
}

export async function generateMetadata({ params }: ReadBookPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { book } = await getBookByIdAction(resolvedParams.id)

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found",
    }
  }

  return {
    title: `Reading: ${book.title} | BookExplorer`,
    description: `Read ${book.title} by ${book.author} on BookExplorer`,
  }
}

export default async function ReadBookPage({ params }: ReadBookPageProps) {
  const resolvedParams = await params
  const { book, error } = await getBookByIdAction(resolvedParams.id)

  if (!book) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/books/${resolvedParams.id}`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Book Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{book.title}</h1>
        <p className="text-lg text-muted-foreground">by {book.author}</p>
      </div>

      <BookReader bookId={book.id} title={book.title} previewUrl={book.previewLink} coverImage={book.coverImage} />
    </main>
  )
}

