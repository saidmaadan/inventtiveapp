"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

type Newsletter = {
  id: string
  subject: string
  content: string
  status: string
  scheduledFor: string | null
  sentAt: string | null
  createdAt: string
}

export default function PreviewNewsletterPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const res = await fetch(`/api/admin/newsletter/${params.id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch newsletter")
        }
        const data = await res.json()
        setNewsletter(data)
      } catch (error) {
        console.error("Error fetching newsletter:", error)
        toast.error("Failed to fetch newsletter")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNewsletter()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!newsletter) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Newsletter not found</h2>
          <Button
            onClick={() => router.push("/admin/newsletter")}
            className="mt-4"
          >
            Back to Newsletters
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Newsletter Preview</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/newsletter")}
          >
            Back
          </Button>
          <Button
            onClick={() => router.push(`/admin/newsletter/${params.id}`)}
          >
            Edit
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{newsletter.subject}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: newsletter.content }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
