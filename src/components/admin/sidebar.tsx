"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  LayoutDashboard,
  FileText,
  Settings,
} from "lucide-react"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
      active: pathname.startsWith("/admin/users"),
    },
    {
      label: "Newsletter",
      icon: Mail,
      href: "/admin/newsletter",
      active: pathname.startsWith("/admin/newsletter"),
    },
    {
      label: "Blogs",
      icon: FileText,
      href: "/admin/blogs",
      active: pathname.startsWith("/admin/blogs"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname.startsWith("/admin/settings"),
    },
  ]

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div className={cn(
          "flex items-center justify-between mb-4 pl-2",
          isCollapsed && "justify-center pl-0"
        )}>
          {!isCollapsed && (
            <div className="font-semibold text-lg">Admin Panel</div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-2 rounded-lg transition-all hover:text-slate-600 hover:bg-slate-100",
                route.active && "text-slate-700 bg-slate-100",
                isCollapsed ? "justify-center pl-0 w-10 h-10 mx-auto" : "h-10 w-full"
              )}
            >
              <route.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
