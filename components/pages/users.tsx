"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, Eye, Settings } from "lucide-react"

export function UsersPage() {
  const users = [
    { id: 1, name: "Admin User", email: "admin@ethiopiangrid.gov.et", role: "admin", status: "active" },
    { id: 2, name: "Grid Operator 1", email: "operator1@ethiopiangrid.gov.et", role: "operator", status: "active" },
    { id: 3, name: "Grid Operator 2", email: "operator2@ethiopiangrid.gov.et", role: "operator", status: "active" },
    { id: 4, name: "Viewer User", email: "viewer@ethiopiangrid.gov.et", role: "viewer", status: "inactive" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <Button>Add New User</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-blue-600">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg text-white">{user.name}</CardTitle>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge
                  variant="outline"
                  className={
                    user.role === "admin"
                      ? "text-red-400 border-red-400"
                      : user.role === "operator"
                        ? "text-yellow-400 border-yellow-400"
                        : "text-blue-400 border-blue-400"
                  }
                >
                  {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                  {user.role === "operator" && <Settings className="h-3 w-3 mr-1" />}
                  {user.role === "viewer" && <Eye className="h-3 w-3 mr-1" />}
                  {user.role}
                </Badge>
                <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
