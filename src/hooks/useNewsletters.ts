import { useState, useEffect } from "react"
import type { Newsletter } from "@/app/(dashboard)/admin/newsletter/columns"

export function useNewsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await fetch("/api/admin/newsletter")
        if (!response.ok) {
          throw new Error("Failed to fetch newsletters")
        }
        const data = await response.json()
        setNewsletters(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error occurred"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchNewsletters()
  }, [])

  return { newsletters, isLoading, error }
}
