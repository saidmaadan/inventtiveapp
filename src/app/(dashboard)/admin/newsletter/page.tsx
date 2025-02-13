"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { columns } from "./columns"
import { useNewsletters } from "@/hooks/useNewsletters"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/admin/newsletter/overview"
import { SubscriberStats } from "@/components/admin/newsletter/subscriber-stats"
import { AddSubscriberDialog } from "@/components/admin/newsletter/add-subscriber-dialog"

export default function NewsletterPage() {
  const router = useRouter()
  const { newsletters, isLoading, error } = useNewsletters()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNewsletters = newsletters?.filter(
    (newsletter) =>
      newsletter.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200">
        <h3 className="font-semibold">Error loading newsletters</h3>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Newsletter Management</h1>
        <Button
          onClick={() => router.push("/admin/newsletter/create")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Newsletter
        </Button>
      </div>

      <Tabs defaultValue="newsletters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="newsletters" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Newsletters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search newsletters..."
                    className="w-full p-2 border rounded-md bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <DataTable
                  columns={columns}
                  data={filteredNewsletters || []}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <Overview />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Subscriber Management</h2>
              <AddSubscriberDialog />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <SubscriberStats />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
