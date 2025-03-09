"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AnimatedCard } from "@/components/ui/animated-card"
import { AnimatedText } from "@/components/ui/animated-text"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Book cover images for the animated cards
  const bookCovers = ["/book-covers/fantasy-book.jpg", "/book-covers/mystery-book.jpg", "/book-covers/scifi-book.jpg"]

  if (!mounted) return null

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <AnimatedText
                text="Discover Your Next Favorite Book"
                as="h1"
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                delay={0.2}
              />

              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Search millions of books from multiple sources, read reviews, and find your next great read.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Button size="lg" asChild className="relative overflow-hidden group">
                <Link href="/browse">
                  Browse Books
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      duration: 2,
                      repeatDelay: 5,
                    }}
                  />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild className="relative overflow-hidden">
                <Link href="/categories">
                  Explore Categories
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-primary"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </Button>
            </motion.div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-[300px] sm:h-[450px] sm:w-[400px]">
              {/* Animated book covers */}
              <AnimatedCard
                imageUrl={bookCovers[0]}
                className="absolute right-0 top-0 h-[300px] w-[250px] sm:h-[400px] sm:w-[320px]"
                rotateStart={15}
                rotateEnd={6}
                delay={0.2}
              />

              {/* <AnimatedCard
                imageUrl={bookCovers[1]}
                className="absolute left-0 top-10 h-[300px] w-[250px] sm:h-[400px] sm:w-[320px]"
                rotateStart={-15}
                rotateEnd={-6}
                delay={0.4}
              /> */}

              {/* <AnimatedCard
                imageUrl={bookCovers[2]}
                className="absolute left-10 top-20 h-[300px] w-[250px] sm:h-[400px] sm:w-[320px]"
                rotateStart={0}
                rotateEnd={0}
                delay={0.6}
              /> */}

              {/* Floating particles */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-primary/40"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

