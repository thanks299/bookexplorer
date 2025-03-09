import Link from "next/link"
import { BookOpen, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 md:py-16">
        {/* Newsletter Section */}
        <div className="mb-12 rounded-lg bg-primary/5 p-6 md:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-xl font-semibold md:text-2xl">Stay Updated with BookExplorer</h3>
            <p className="mt-2 text-muted-foreground">
              Subscribe to our newsletter for the latest book recommendations and reading insights.
            </p>
            <form className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
              <div className="flex-1">
                <Input type="email" placeholder="Enter your email" className="w-full" required />
              </div>
              <Button type="submit" className="flex items-center gap-2">
                Subscribe <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2" scroll={true}>
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">BookExplorer</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your one-stop platform for book discovery and exploration. Find your next great read with our curated
              recommendations.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="rounded-full bg-primary/10 p-2 text-primary hover:bg-primary/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/browse"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Browse Books
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/fiction"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/non-fiction"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Non-Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/science-fiction"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Science Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/mystery"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Mystery & Thriller
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground transition-colors hover:text-primary" scroll={true}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  scroll={true}
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-base font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1 text-muted-foreground"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-sm text-muted-foreground">
                  123 Book Street, Suite 101
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-muted-foreground" size={20} />
                <span className="text-sm text-muted-foreground">contact@bookexplorer.com</span>
              </li>
              <li className="mt-4">
                <Link href="/contact" scroll={true}>
                  <Button variant="outline" className="w-full">
                    Get in Touch
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright and Bottom Links */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BookExplorer. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link href="/accessibility" className="hover:text-primary" scroll={true}>
                Accessibility
              </Link>
              <Link href="/sitemap" className="hover:text-primary" scroll={true}>
                Sitemap
              </Link>
              <Link href="/cookies" className="hover:text-primary" scroll={true}>
                Cookie Policy
              </Link>
              <Link href="/legal" className="hover:text-primary" scroll={true}>
                Legal Notices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

