"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  ArrowRight,
} from "lucide-react"

const footerLinks = {
  product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
    { href: "/docs", label: "Documentation" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
    { href: "/brand", label: "Brand" },
  ],
  resources: [
    { href: "/help", label: "Help Center" },
    { href: "/guides", label: "Guides" },
    { href: "/api", label: "API" },
    { href: "/status", label: "Status" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/security", label: "Security" },
    { href: "/cookies", label: "Cookies" },
  ],
}

const socialLinks = [
  {
    href: "https://twitter.com/inventtive",
    label: "Twitter",
    icon: Twitter,
  },
  {
    href: "https://github.com/inventtive",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://linkedin.com/company/inventtive",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "https://facebook.com/inventtive",
    label: "Facebook",
    icon: Facebook,
  },
]

export function SiteFooter() {
  const [email, setEmail] = React.useState("")
  const [isSubscribing, setIsSubscribing] = React.useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setIsSubscribing(true)
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      toast.success("Successfully subscribed to newsletter!")
      setEmail("")
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <footer className="border-t bg-background">
      <div className="container-center py-12 md:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold">Product</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest updates, tips, and
              resources.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="w-full gap-2" disabled={isSubscribing}>
                {isSubscribing ? "Subscribing..." : "Subscribe"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{link.label}</span>
                    <Icon className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Inventtive. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
