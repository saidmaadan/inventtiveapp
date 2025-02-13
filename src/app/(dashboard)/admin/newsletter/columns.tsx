"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, Send, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export type Newsletter = {
  id: string
  subject: string
  content: string
  status: "DRAFT" | "SCHEDULED" | "SENT"
  scheduledFor?: Date | null
  sentAt?: Date | null
  openRate?: number
  clickRate?: number
  createdAt: Date
}

export const columns: ColumnDef<Newsletter>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "SENT"
              ? "default"
              : status === "SCHEDULED"
              ? "secondary"
              : "outline"
          }
        >
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: "scheduledFor",
    header: "Scheduled For",
    cell: ({ row }) => {
      const date = row.getValue("scheduledFor") as Date
      return date ? format(new Date(date), "MMM d, yyyy HH:mm") : "-"
    },
  },
  {
    accessorKey: "sentAt",
    header: "Sent At",
    cell: ({ row }) => {
      const date = row.getValue("sentAt") as Date
      return date ? format(new Date(date), "MMM d, yyyy HH:mm") : "-"
    },
  },
  {
    accessorKey: "openRate",
    header: "Open Rate",
    cell: ({ row }) => {
      const rate = row.getValue("openRate") as number
      return rate ? `${(rate * 100).toFixed(1)}%` : "-"
    },
  },
  {
    accessorKey: "clickRate",
    header: "Click Rate",
    cell: ({ row }) => {
      const rate = row.getValue("clickRate") as number
      return rate ? `${(rate * 100).toFixed(1)}%` : "-"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const newsletter = row.original
      const router = useRouter()

      const handleSend = async () => {
        if (!confirm("Are you sure you want to send this newsletter now?")) return
        try {
          const res = await fetch(`/api/admin/newsletter/${newsletter.id}/send`, {
            method: "POST",
          })
          if (!res.ok) throw new Error("Failed to send newsletter")
          toast.success("Newsletter sent successfully")
          router.refresh()
        } catch (error) {
          console.error("Error sending newsletter:", error)
          toast.error("Failed to send newsletter")
        }
      }

      const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this newsletter?")) return
        try {
          const res = await fetch(`/api/admin/newsletter/${newsletter.id}`, {
            method: "DELETE",
          })
          if (!res.ok) throw new Error("Failed to delete newsletter")
          toast.success("Newsletter deleted successfully")
          router.refresh()
        } catch (error) {
          console.error("Error deleting newsletter:", error)
          toast.error("Failed to delete newsletter")
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/newsletter/${newsletter.id}`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/admin/newsletter/${newsletter.id}/preview`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </DropdownMenuItem>
            {newsletter.status === "DRAFT" && (
              <DropdownMenuItem onClick={handleSend}>
                <Send className="mr-2 h-4 w-4" />
                Send Now
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
