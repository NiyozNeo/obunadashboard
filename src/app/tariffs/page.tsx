"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * usersPerPage;
        let url = `${process.env.BACKEND_URL}/admin/tariffs?limit=${usersPerPage}&offset=${offset}`;
        if (searchTerm) {
          url += `&name=${searchTerm}`;
        }

        // if (roleFilter !== "All" && roleFilter) {
        //   url += `&role=${roleFilter}`;
        // }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("session")}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setTariffs(data.data);
        setTotalItems(data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm]);

  const handleEditTariff = (tariff: Tariff) => {
    setEditingTariff(tariff);
  };

  const totalPages = Math.ceil(totalItems / usersPerPage);

  const editTariff = async () => {
    if (!editingTariff) return;

    try {
      // const response = await fetch(
      //   `${process.env.BACKEND_URL}/admin/users/${editingUser.id}`,
      //   {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${localStorage.getItem("session")}`,
      //     },
      //     body: JSON.stringify({
      //       name: name ?? editingUser.name,
      //       role: edtingRole ?? editingUser.role,
      //     }),
      //   }
      // );
      // if (!response.ok) throw new Error("Network response was not ok");
      // const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <SidebarInset>
          <h1 className="text-2xl font-bold mb-5">Tariflar</h1>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            {/* <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Hammasi</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="accountant">accountant</SelectItem>
                  <SelectItem value="admin">admin</SelectItem>
                </SelectContent>
              </Select> */}
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableCaption>A list of your users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Info</TableHead>
                  <TableHead>Narxi</TableHead>
                  <TableHead>Turi</TableHead>
                  <TableHead>Obunachilar</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Kanal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tariffs.map((tariff) => (
                  <TableRow key={tariff.id}>
                    <TableCell className="font-medium">{tariff.id}</TableCell>
                    <TableCell>{tariff.name}</TableCell>
                    <TableCell>{tariff.info}</TableCell>
                    <TableCell>{tariff.price}</TableCell>
                    <TableCell>{tariff.type}</TableCell>
                    <TableCell>{tariff.subscribersCount} ta</TableCell>
                    <TableCell>{tariff.link}</TableCell>
                    <TableCell>{tariff.channel.name}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTariff(tariff)}
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
                                defaultValue={editTariff?.name}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="role" className="text-right">
                                Role
                              </Label>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button onClick={editTariff} type="submit">
                              Save changes
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

interface Channel {
  id: number;
  name: string;
  telegram_id: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  info: string | null;
  photo: string;
  photo_small: string;
}

interface Tariff {
  id: number;
  name: string;
  price: number;
  type: string;
  channel_id: number;
  is_active: boolean;
  link: string;
  createdAt: string;
  updatedAt: string;
  info: string | null;
  channel: Channel;
  Subscription: null; // Use `any` if Subscription details are undefined; replace with proper type if available.
  subscribersCount: number;
}
