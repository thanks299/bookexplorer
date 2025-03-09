import Link from "next/link"
import {
  Book,
  BookOpen,
  Coffee,
  Compass,
  Dna,
  Globe,
  Heart,
  History,
  Lightbulb,
  Music,
  Palette,
  Users,
} from "lucide-react"

export default function CategoriesPage() {
  const categories = [
    { name: "Fiction", icon: <Book className="h-6 w-6" />, count: 1245 },
    { name: "Science Fiction", icon: <Compass className="h-6 w-6" />, count: 867 },
    { name: "Mystery", icon: <Lightbulb className="h-6 w-6" />, count: 932 },
    { name: "Biography", icon: <Users className="h-6 w-6" />, count: 753 },
    { name: "History", icon: <History className="h-6 w-6" />, count: 621 },
    { name: "Science", icon: <Dna className="h-6 w-6" />, count: 548 },
    { name: "Self Help", icon: <Heart className="h-6 w-6" />, count: 489 },
    { name: "Travel", icon: <Globe className="h-6 w-6" />, count: 376 },
    { name: "Art", icon: <Palette className="h-6 w-6" />, count: 298 },
    { name: "Music", icon: <Music className="h-6 w-6" />, count: 245 },
    { name: "Philosophy", icon: <BookOpen className="h-6 w-6" />, count: 187 },
    { name: "Cooking", icon: <Coffee className="h-6 w-6" />, count: 321 },
  ]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Browse books by category</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {category.icon}
              </div>
              <div>
                <h2 className="font-semibold">{category.name}</h2>
                <p className="text-sm text-muted-foreground">{category.count} books</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}

