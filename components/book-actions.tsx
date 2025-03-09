"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share, BookOpen, Check, Copy, Facebook, Twitter, Linkedin, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useFavorites } from "@/lib/favorites-context"
import type { Book } from "@/lib/types"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface BookActionsProps {
  book: Book
  layout?: "vertical" | "horizontal"
  showReadButton?: boolean
}

export function BookActions({ book, layout = "vertical", showReadButton = true }: BookActionsProps) {
  const { user } = useAuth()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  const router = useRouter()
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const bookUrl = typeof window !== "undefined" ? `${window.location.origin}/books/${book.id}` : `/books/${book.id}`

  const handleFavoriteToggle = () => {
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

  const handleShare = () => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    setShareDialogOpen(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaService = (service: string) => {
    let shareUrl = ""
    const text = `Check out "${book.title}" by ${book.author} on BookExplorer`

    switch (service) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(bookUrl)}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(bookUrl)}`
        break
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(bookUrl)}`
        break
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}

${bookUrl}`)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }

    setShareDialogOpen(false)
  }

  if (layout === "horizontal") {
    return (
      <>
        <div className="flex gap-2">
          {showReadButton && (
            <Button asChild>
              <a href={`/books/${book.id}/read`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Read Book
              </a>
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleFavoriteToggle}
            className={isFavorite(book.id) ? "bg-primary/10" : ""}
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorite(book.id) ? "fill-primary text-primary" : ""}`} />
            {isFavorite(book.id) ? "Saved" : "Save"}
          </Button>

          <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share this book</DialogTitle>
                <DialogDescription>Share "{book.title}" with others</DialogDescription>
              </DialogHeader>

              <div className="flex items-center space-x-2 mt-4">
                <Input value={bookUrl} readOnly />
                <Button size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" size="icon" onClick={() => shareViaService("facebook")}>
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Share on Facebook</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => shareViaService("twitter")}>
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Share on Twitter</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => shareViaService("linkedin")}>
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">Share on LinkedIn</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => shareViaService("email")}>
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Share via Email</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {showReadButton && (
          <Button className="w-full" asChild>
            <a href={`/books/${book.id}/read`}>
              <BookOpen className="mr-2 h-4 w-4" />
              Read Book
            </a>
          </Button>
        )}

        <Button
          variant="outline"
          className={`w-full ${isFavorite(book.id) ? "bg-primary/10" : ""}`}
          onClick={handleFavoriteToggle}
        >
          <Heart className={`mr-2 h-4 w-4 ${isFavorite(book.id) ? "fill-primary text-primary" : ""}`} />
          {isFavorite(book.id) ? "Saved to Favorites" : "Add to Favorites"}
        </Button>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share this book</DialogTitle>
              <DialogDescription>Share "{book.title}" with others</DialogDescription>
            </DialogHeader>

            <div className="flex items-center space-x-2 mt-4">
              <Input value={bookUrl} readOnly />
              <Button size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" size="icon" onClick={() => shareViaService("facebook")}>
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => shareViaService("twitter")}>
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Share on Twitter</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => shareViaService("linkedin")}>
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">Share on LinkedIn</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => shareViaService("email")}>
                <Mail className="h-5 w-5" />
                <span className="sr-only">Share via Email</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

