import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { FavoritesProvider } from "@/lib/favorites-context"
import { ToastProvider } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { PageTransition } from "@/components/ui/page-transition"
import { BouncingCursor } from "@/components/ui/bouncing-cursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Book Explorer - Discover Your Next Read",
  description: "Search and discover books from multiple sources in one place",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <ToastProvider>
            <AuthProvider>
              <FavoritesProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <div className="flex-1">
                    <PageTransition>{children}</PageTransition>
                  </div>
                  <Footer />
                </div>
                <Toaster />
                <BouncingCursor />
              </FavoritesProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

