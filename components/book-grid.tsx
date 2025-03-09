"use client"

import type { Book } from "@/lib/types"
import { BookCard } from "@/components/book-card"
import { motion } from "framer-motion"

interface BookGridProps {
  books: Book[]
}

export function BookGrid({ books }: BookGridProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {books.map((book, index) => (
        <BookCard key={book.id} book={book} index={index} />
      ))}
    </motion.div>
  )
}

