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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface User2 {
  id: number;
  name: string;
  second_name: string | null;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userFilter, setUserFilter] = useState("");
  const [users, setUsers] = useState<User2[]>([]);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * usersPerPage;
        let url = `${process.env.BACKEND_URL}/admin/channel-all?limit=${usersPerPage}&offset=${offset}`;
        if (searchTerm) {
          url += `&name=${searchTerm}`;
        }

        if (userFilter !== "All" && userFilter) {
          url += `&user_id=${userFilter}`;
        }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("session")}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const channelResponse = await fetch(
          `${process.env.BACKEND_URL}/admin/creators`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("session")}`,
            },
          }
        );

        if (!channelResponse.ok) throw new Error("Network response was not ok");

        const uData = await channelResponse.json();
        setUsers(uData.data);

        const data = await response.json();
        setChannels(data.data);
        setTotalItems(data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, userFilter]);

  const handleEditChannel = (channel: Channel) => {
    setEditingChannel(channel);
  };

  const totalPages = Math.ceil(totalItems / usersPerPage);

  const editChannel = async () => {
    if (!editingChannel) return;

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
          <h1 className="text-2xl font-bold mb-5">Channels</h1>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Hammasi</SelectItem>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={`${user.id}`}>
                    {user.name + (user.second_name ? " " + user.second_name : "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <TableHead>Telegram id</TableHead>
                  <TableHead>Tariflar</TableHead>
                  <TableHead>Obunachilar</TableHead>
                  <TableHead>Egasi</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">{channel.id}</TableCell>
                    <TableCell>{channel.name}</TableCell>
                    <TableCell>{channel.info}</TableCell>
                    <TableCell>{channel.telegram_id}</TableCell>
                    <TableCell>{channel.tariffsCount} ta</TableCell>
                    <TableCell>{channel.subscribersCount} ta</TableCell>
                    <TableCell>{channel.user.name}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditChannel(channel)}
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
                                defaultValue={editingChannel?.name}
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
                            <Button onClick={editChannel} type="submit">
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
}

interface User {
  id: number;
  name: string;
  second_name: string | null;
  telegram_id: string;
  phone: string;
  choosen_taraiff_link: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
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
  tariffs: Tariff[];
  user: User;
  tariffsCount: number;
  subscribersCount: number;
}
