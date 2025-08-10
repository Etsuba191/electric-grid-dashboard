"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  LayoutDashboard,
  Settings,
  Info,
  Zap,
  BarChart3,
  Map,
  Bell,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "next-themes"

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  userRole: "admin" | "user"
  onRoleChange: (role: "admin" | "user") => void
  currentPage: string
  onPageChange: (page: string) => void
}

export function Sidebar({ isOpen, onToggle, userRole, onRoleChange, currentPage, onPageChange }: SidebarProps) {
  const { theme, setTheme } = useTheme()

  const menuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", admin: false },
    { id: "grid", icon: Zap, label: "Grid Status", admin: false },
    { id: "analytics", icon: BarChart3, label: "Analytics", admin: false },
    { id: "map", icon: Map, label: "Grid Map", admin: false },
    { id: "alerts", icon: Bell, label: "Alerts", admin: false },
    { id: "users", icon: Users, label: "User Management", admin: true },
    { id: "settings", icon: Settings, label: "Settings", admin: true },
    { id: "about", icon: Info, label: "About", admin: false },
  ]

  const filteredItems = menuItems.filter((item) => !item.admin || userRole === "admin")

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">GridMonitor</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onToggle} className="text-slate-400 hover:text-white">
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-blue-600">{userRole === "admin" ? "AD" : "US"}</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-white">
                  {userRole === "admin" ? "Admin User" : "Grid Operator"}
                </p>
                <Badge variant={userRole === "admin" ? "default" : "secondary"} className="text-xs">
                  {userRole === "admin" ? <Shield className="h-3 w-3 mr-1" /> : null}
                  {userRole.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Ethiopian Power Grid</p>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Role:</span>
              <Switch
                checked={userRole === "admin"}
                onCheckedChange={(checked) => onRoleChange(checked ? "admin" : "user")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={currentPage === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 ${
                  currentPage === item.id ? "bg-slate-800 text-white" : ""
                } ${!isOpen ? "px-2" : ""}`}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className={`h-5 w-5 ${isOpen ? "mr-3" : ""}`} />
                {isOpen && item.label}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Theme Toggle */}
      {isOpen && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>Theme</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-400 hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
