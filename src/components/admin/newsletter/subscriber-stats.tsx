"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, subMonths } from "date-fns"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"

interface SubscriberGrowth {
  date: string
  subscribers: number
  unsubscribes: number
}

interface SubscriberSource {
  source: string
  count: number
  percentage: number
}

interface Subscriber {
  email: string
  subscribedAt: string
  source: string
  status: "ACTIVE" | "UNSUBSCRIBED"
}

const subscriberColumns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "subscribedAt",
    header: "Subscribed At",
    cell: ({ row }) => {
      return format(new Date(row.getValue("subscribedAt")), "MMM d, yyyy")
    },
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status.toLowerCase()}
        </span>
      )
    },
  },
]

export function SubscriberStats() {
  const [growthData, setGrowthData] = useState<SubscriberGrowth[]>([])
  const [sourceData, setSourceData] = useState<SubscriberSource[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [growthRes, sourceRes, subscribersRes] = await Promise.all([
          fetch("/api/admin/newsletter/subscriber-growth"),
          fetch("/api/admin/newsletter/subscriber-sources"),
          fetch("/api/admin/newsletter/subscribers"),
        ])

        if (!growthRes.ok || !sourceRes.ok || !subscribersRes.ok) {
          throw new Error("Failed to fetch subscriber data")
        }

        const [growthData, sourceData, subscribersData] = await Promise.all([
          growthRes.json(),
          sourceRes.json(),
          subscribersRes.json(),
        ])

        setGrowthData(growthData)
        setSourceData(sourceData)
        setSubscribers(subscribersData)
      } catch (error) {
        console.error("Error fetching subscriber data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <Card>
          <CardHeader>
            <CardTitle>Subscriber Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] bg-slate-100 rounded" />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center"
                    >
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                      <div className="h-4 w-16 bg-slate-200 rounded" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={growthData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "MMM d")}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) =>
                    format(new Date(label), "MMM d, yyyy")
                  }
                />
                <Bar
                  dataKey="subscribers"
                  name="New Subscribers"
                  fill="#8884d8"
                />
                <Bar
                  dataKey="unsubscribes"
                  name="Unsubscribes"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceData.map((source) => (
                <div
                  key={source.source}
                  className="flex justify-between items-center"
                >
                  <span className="font-medium">{source.source}</span>
                  <span className="text-muted-foreground">
                    {source.count.toLocaleString()} ({source.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={subscriberColumns}
            data={subscribers}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  )
}
