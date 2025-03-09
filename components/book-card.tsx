"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import type { Book } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

interface BookCardProps {
  book: Book
  layout?: "grid" | "list"
  index?: number
}

export function BookCard({ book, layout = "grid", index = 0 }: BookCardProps) {
  const { user } = useAuth()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const router = useRouter()
  const { toast } = useToast()

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push("/auth/signin")
      return
    }

    if (isFavorite(book.id)) {
      removeFromFavorites(book.id)
    } else {
      addToFavorites(book)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  if (layout === "list") {
    return (
      <motion.div
        className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="relative h-[180px] w-[120px] flex-shrink-0 overflow-hidden rounded-md">
          <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0"
            whileHover={{ opacity: 1 }}
          />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/books/${book.id}`}>
                  <motion.h3
                    className="font-semibold text-lg hover:underline"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {book.title}
                  </motion.h3>
                </Link>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{book.rating}</span>
                <motion.span
                  className="text-yellow-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                >
                  ★
                </motion.span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-sm line-clamp-3">{book.description}</p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {book.source} • {book.publishedDate}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleFavoriteToggle}
                className={isFavorite(book.id) ? "bg-primary/10" : ""}
              >
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Heart className={`mr-1 h-4 w-4 ${isFavorite(book.id) ? "fill-primary text-primary" : ""}`} />
                </motion.div>
                {isFavorite(book.id) ? "Saved" : "Save"}
              </Button>
              <Button size="sm" asChild>
                <Link href={`/books/${book.id}/read`}>
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="mr-1">
                    <BookOpen className="h-4 w-4" />
                  </motion.div>
                  Preview
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-colors hover:bg-muted/50"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Link href={`/books/${book.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {book.title}</span>
      </Link>
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={book.coverImage || "/placeholder.svg"}
          alt={book.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
        />
        <div className="absolute top-2 right-2 z-20">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              variant={isFavorite(book.id) ? "default" : "secondary"}
              className="h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              onClick={handleFavoriteToggle}
            >
              <motion.div animate={isFavorite(book.id) ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                <Heart className={`h-4 w-4 ${isFavorite(book.id) ? "fill-primary-foreground" : ""}`} />
              </motion.div>
              <span className="sr-only">Add to favorites</span>
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <motion.h3
            className="font-semibold line-clamp-1"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {book.title}
          </motion.h3>
          <p className="text-sm text-muted-foreground line-clamp-1">by {book.author}</p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-sm font-medium">{book.rating}</span>
            <motion.span
              className="text-yellow-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
            >
              ★
            </motion.span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">{book.source}</div>
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
            <Button size="sm" variant="ghost" className="z-20 h-8 w-8 p-0" asChild>
              <Link href={`/books/${book.id}/read`}>
                <BookOpen className="h-4 w-4" />
                <span className="sr-only">Read</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

