"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

interface AnimatedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  delay?: number
}

export function AnimatedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes,
  delay = 0,
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isLoaded ? 1 : 0,
        scale: isLoaded ? 1 : 0.9,
      }}
      transition={{
        opacity: { duration: 0.5, delay: delay },
        scale: { type: "spring", stiffness: 100, delay: delay },
      }}
    >
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={`transition-all duration-700 ${className}`}
        onLoad={() => setIsLoaded(true)}
      />

      {/* Loading shimmer effect */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
          }}
        />
      )}
    </motion.div>
  )
}

