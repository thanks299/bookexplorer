"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function BouncingCursor() {
  const isMobile = useMobile()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isMobile) return

    // Show cursor on touch
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      setPosition({ x: touch.clientX, y: touch.clientY })
      setLastTouch({ x: touch.clientX, y: touch.clientY })
      setVisible(true)
    }

    // Update cursor position on touch move
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      setPosition({ x: touch.clientX, y: touch.clientY })
      setLastTouch({ x: touch.clientX, y: touch.clientY })
    }

    // Hide cursor after touch end with a delay
    const handleTouchEnd = () => {
      // Keep the cursor visible for a moment after touch
      setTimeout(() => {
        setVisible(false)
      }, 1500)
    }

    // Add event listeners
    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    // Clean up
    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isMobile])

  // If not on mobile, don't render anything
  if (!isMobile) return null

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      animate={{
        x: visible ? position.x : lastTouch.x,
        y: visible ? position.y : lastTouch.y,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 150,
      }}
    >
      <motion.div
        className="w-6 h-6 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm"
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <motion.div
          className="w-3 h-3 bg-primary rounded-full"
          animate={{ scale: [1, 0.8, 1] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

