"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from "framer-motion"
import Image from "next/image"

interface AnimatedCardProps {
  imageUrl?: string
  color?: string
  delay?: number
  rotateStart?: number
  rotateEnd?: number
  className?: string
  children?: React.ReactNode
}

export function AnimatedCard({
  imageUrl,
  color = "bg-primary/10",
  delay = 0,
  rotateStart = -10,
  rotateEnd = 0,
  className = "",
  children,
}: AnimatedCardProps) {
  const controls = useAnimation()
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse movement animation
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10])
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10])
  const brightness = useTransform(mouseY, [-100, 100], [1.1, 0.9])

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  // Initial animation
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      rotate: rotateEnd,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay,
      },
    })
  }, [controls, delay, rotateEnd])

  return (
    <motion.div
      ref={ref}
      className={`relative rounded-lg shadow-lg overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 50, rotate: rotateStart }}
      animate={controls}
      whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        x.set(0)
        y.set(0)
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        filter: `brightness(${isHovered ? brightness : 1})`,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {imageUrl ? (
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt="Book cover"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      ) : (
        <div className={`w-full h-full ${color}`}>{children}</div>
      )}

      {/* Shine effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          style={{
            backgroundSize: "200% 200%",
            backgroundPosition: "right bottom",
          }}
        />
      )}
    </motion.div>
  )
}

