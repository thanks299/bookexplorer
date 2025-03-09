import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Calendar, User, BookMarked } from "lucide-react"
import { getBookByIdAction, getSimilarBooksAction } from "@/app/actions"
import type { Metadata } from "next"
import { BookPreview } from "@/components/book-preview"
import { BookActions } from "@/components/book-actions"

interface BookPageProps {
  params: Promise<{ id: string }> | { id: string }
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const { book } = await getBookByIdAction(resolvedParams.id)

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found",
    }
  }

  return {
    title: `${book.title} by ${book.author} | BookExplorer`,
    description: book.description.substring(0, 160),
    openGraph: {
      title: book.title,
      description: book.description.substring(0, 160),
      images: [book.coverImage],
    },
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const resolvedParams = await params
  const { book, error } = await getBookByIdAction(resolvedParams.id)

  if (!book) {
    notFound()
  }

  const { books: similarBooks } = await getSimilarBooksAction(book, 4)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
        <div className="space-y-4">
          <div className="relative mx-auto aspect-[2/3] w-[200px] overflow-hidden rounded-lg sm:w-[250px] lg:w-full">
            <Image
              src={book.coverImage || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <BookActions book={book} />

          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Book Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="flex items-center text-muted-foreground">
                  <BookMarked className="mr-2 h-4 w-4" />
                  Publisher
                </dt>
                <dd>{book.publisher}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Published
                </dt>
                <dd>{book.publishedDate}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Language
                </dt>
                <dd>{book.language}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center text-muted-foreground">
                  <Star className="mr-2 h-4 w-4" />
                  Rating
                </dt>
                <dd className="flex items-center">
                  {book.rating > 0 ? (
                    <>
                      {book.rating}
                      <span className="ml-1 text-yellow-400">★</span>
                    </>
                  ) : (
                    "Not rated"
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span>/</span>
              <Link href="/browse" className="hover:underline">
                Browse
              </Link>
              {book.categories.length > 0 && (
                <>
                  <span>/</span>
                  <Link
                    href={`/categories/${book.categories[0].toLowerCase().replace(/\s+/g, "-")}`}
                    className="hover:underline"
                  >
                    {book.categories[0]}
                  </Link>
                </>
              )}
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">{book.title}</h1>
            <p className="text-lg text-muted-foreground">by {book.author}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="similar">Similar Books</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="prose max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: book.description }} />

                <h3>About the Author</h3>
                <p>
                  {book.author} is the author of {book.title}.
                  {book.source === "Google Books"
                    ? " This book is available on Google Books."
                    : " This book is available on Open Library."}
                </p>
              </div>
            </TabsContent>
            <TabsContent value="preview">
              <BookPreview previewUrl={book.previewLink} title={book.title} />
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★★</span>
                      <span className="ml-2 text-sm text-muted-foreground">2 months ago</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  This book completely captivated me from start to finish. The character development is outstanding, and
                  the plot twists kept me guessing. Highly recommend!
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael Rodriguez</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★★★★☆</span>
                      <span className="ml-2 text-sm text-muted-foreground">1 month ago</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  A compelling read with rich world-building and memorable characters. The middle section dragged a bit,
                  but the ending more than made up for it.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="similar" className="space-y-4">
              {similarBooks.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {similarBooks.map((similarBook) => (
                    <div
                      key={similarBook.id}
                      className="group relative flex flex-col overflow-hidden rounded-lg border"
                    >
                      <Link href={`/books/${similarBook.id}`} className="absolute inset-0 z-10">
                        <span className="sr-only">View {similarBook.title}</span>
                      </Link>
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <Image
                          src={similarBook.coverImage || "/placeholder.svg"}
                          alt={similarBook.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="line-clamp-1 font-medium">{similarBook.title}</h4>
                        <p className="text-sm text-muted-foreground">{similarBook.author}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No similar books found</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

