"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface PerformanceData {
  date: string
  openRate: number
  clickRate: number
}

interface OverviewStats {
  totalSent: number
  averageOpenRate: number
  averageClickRate: number
  totalSubscribers: number
}

export function Overview() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [stats, setStats] = useState<OverviewStats>({
    totalSent: 0,
    averageOpenRate: 0,
    averageClickRate: 0,
    totalSubscribers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [performanceRes, statsRes] = await Promise.all([
          fetch("/api/admin/newsletter/performance"),
          fetch("/api/admin/newsletter/stats"),
        ])

        if (!performanceRes.ok || !statsRes.ok) {
          throw new Error("Failed to fetch newsletter data")
        }

        const [performanceData, statsData] = await Promise.all([
          performanceRes.json(),
          statsRes.json(),
        ])

        setPerformanceData(performanceData)
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching newsletter data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <div className="h-8 w-16 bg-slate-200 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] bg-slate-100 rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const metrics = [
    {
      title: "Total Newsletters Sent",
      value: stats.totalSent.toLocaleString(),
    },
    {
      title: "Average Open Rate",
      value: `${(stats.averageOpenRate * 100).toFixed(1)}%`,
    },
    {
      title: "Average Click Rate",
      value: `${(stats.averageClickRate * 100).toFixed(1)}%`,
    },
    {
      title: "Total Subscribers",
      value: stats.totalSubscribers.toLocaleString(),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
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
                <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                <Tooltip
                  formatter={(value: number) =>
                    `${(value * 100).toFixed(1)}%`
                  }
                  labelFormatter={(label) =>
                    format(new Date(label), "MMM d, yyyy")
                  }
                />
                <Line
                  type="monotone"
                  dataKey="openRate"
                  name="Open Rate"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="clickRate"
                  name="Click Rate"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
