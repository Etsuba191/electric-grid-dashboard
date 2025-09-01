"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Eye, Settings, Plus, Trash2 } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Admin User", email: "admin@ethiopiangrid.gov.et", role: "admin", status: "active" },
    { id: 2, name: "Grid Operator 1", email: "operator1@ethiopiangrid.gov.et", role: "operator", status: "active" },
    { id: 3, name: "Grid Operator 2", email: "operator2@ethiopiangrid.gov.et", role: "operator", status: "active" },
    { id: 4, name: "Viewer User", email: "viewer@ethiopiangrid.gov.et", role: "viewer", status: "inactive" },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "operator",
    status: "active"
  })

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Please fill in all required fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      alert("Please enter a valid email address")
      return
    }

    if (users.some(user => user.email === newUser.email)) {
      alert("A user with this email already exists")
      return
    }

    const newId = Math.max(...users.map(u => u.id)) + 1
    const userToAdd: User = {
      id: newId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    }

    setUsers([...users, userToAdd])
    setNewUser({ name: "", email: "", role: "operator", status: "active" })
    setIsDialogOpen(false)
    alert(`User ${newUser.name} has been added successfully!`)
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-muted-foreground">Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Grid Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-muted-foreground">Status</Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="bg-card border-border">
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
                  <CardTitle className="text-lg text-card-foreground">{user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
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
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => toggleUserStatus(user.id)}
                >
                  {user.status === "active" ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
