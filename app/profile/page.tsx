"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Heart, Settings, User } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size={8} />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-[250px_1fr] lg:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden">
                  <Image
                    src={user.image || "/placeholder.svg?height=96&width=96"}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  My Books
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your reading activity</p>
          </div>

          <Tabs defaultValue="books">
            <TabsList>
              <TabsTrigger value="books">My Books</TabsTrigger>
              <TabsTrigger value="activity">Reading Activity</TabsTrigger>
              <TabsTrigger value="reviews">My Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="books" className="space-y-4">
              <div className="rounded-lg border p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">Your library is empty</h2>
                <p className="mt-2 text-muted-foreground">
                  Start adding books to your library by clicking the heart icon on any book.
                </p>
                <Button className="mt-4" asChild>
                  <a href="/browse">Browse Books</a>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="activity">
              <div className="rounded-lg border p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No reading activity yet</h2>
                <p className="mt-2 text-muted-foreground">
                  Your reading progress and history will appear here once you start reading.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="rounded-lg border p-8 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">No reviews yet</h2>
                <p className="mt-2 text-muted-foreground">
                  You haven't written any reviews yet. Share your thoughts on books you've read.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

