"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "User" },
    { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Editor" },
    { id: 6, name: "Eva White", email: "eva@example.com", role: "User" },
    { id: 7, name: "Frank Miller", email: "frank@example.com", role: "Admin" },
    { id: 8, name: "Grace Lee", email: "grace@example.com", role: "User" },
    { id: 9, name: "Henry Wilson", email: "henry@example.com", role: "Editor" },
    { id: 10, name: "Ivy Taylor", email: "ivy@example.com", role: "User" },
  ]

export default function Home() {
    const [currentPage, setCurrentPage] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [roleFilter, setRoleFilter] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const usersPerPage = 20

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const roleMatch = roleFilter === "All" || user.role === roleFilter
      const searchMatch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      return roleMatch && searchMatch
    })
  }, [roleFilter, searchTerm])

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user)
  }


  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }


  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <SidebarInset>
          <div className="py-10">
            <h1 className="text-2xl font-bold mb-5">Foydalanuvchilar</h1>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="role-filter">Filter by Role:</Label>
                <Select
                  value={roleFilter}
                  onValueChange={handleRoleFilterChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="search">Search:</Label>
                <Input
                  id="search"
                  placeholder="Search by name, ID or email"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <Table>
              <TableCaption>A list of your users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {indexOfFirstUser + index + 1}
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="name"
                                defaultValue={editingUser?.name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="email"
                                defaultValue={editingUser?.email}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                              <Select defaultValue={editingUser?.role}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Admin">Admin</SelectItem>
                                  <SelectItem value="Editor">Editor</SelectItem>
                                  <SelectItem value="User">User</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button type="submit">Save changes</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? "default" : "outline"}
                    size="sm"
                    className="mx-1"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                )
              )}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
