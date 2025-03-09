import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact Us | BookExplorer",
  description: "Get in touch with the BookExplorer team",
}

export default function ContactPage() {
  return <ContactPageClient />
}

