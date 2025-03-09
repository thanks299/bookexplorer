import { BookSearch } from "@/components/book-search"
import { getBooksByCategoryAction } from "@/app/actions"
import type { Metadata } from "next"

interface CategoryPageProps {
  params: Promise<{ slug: string }> | { slug: string }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = resolvedParams.slug.replace(/-/g, " ")

  return {
    title: `${category.charAt(0).toUpperCase() + category.slice(1)} Books | BookExplorer`,
    description: `Browse ${category} books on BookExplorer`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const category = resolvedParams.slug.replace(/-/g, " ")
  const { books, error } = await getBooksByCategoryAction(category)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">{category} Books</h1>
          <p className="text-muted-foreground">Browse books in the {category} category</p>
        </div>
        <BookSearch initialBooks={books} />
        {error && <p className="text-destructive mt-4">{error}</p>}
      </div>
    </main>
  )
}

