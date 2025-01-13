"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
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
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptions, setSubscriptions] = useState<PaymentData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [channelData, setChannelData] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * usersPerPage;
        let url = `${process.env.BACKEND_URL}/admin/subscriptions?limit=${usersPerPage}&offset=${offset}`;

        if (channelFilter) {
          url += `&channel_id=${channelFilter}`;
        }

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("session")}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const channelResponse = await fetch(
          `${process.env.BACKEND_URL}/admin/channels`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("session")}`,
            },
          }
        );

        if (!channelResponse.ok) throw new Error("Network response was not ok");

        const channelData = await channelResponse.json();
        setChannelData(channelData);

        const data = await response.json();
        setSubscriptions(data.data);
        setTotalItems(data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, channelFilter]);

  const totalPages = Math.ceil(totalItems / usersPerPage);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <SidebarInset>
          <h1 className="text-2xl font-bold mb-5">Obunalar</h1>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Hammasi</SelectItem>

                {channelData.map((channel) => (
                  <SelectItem key={channel.id} value={`${channel.id}`}>
                    {channel.name}
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
                  <TableHead>Obuna boshlangan vaqt</TableHead>
                  <TableHead>Oxirgi to’lov</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead>Kanal</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.id}
                    </TableCell>
                    <TableCell>{subscription.createdAt}</TableCell>
                    <TableCell>{subscription.last_payment}</TableCell>
                    <TableCell>{subscription.tariff.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={
                            process.env.BACKEND_URL +
                            "/api/images/" +
                            subscription.tariff.channel.photo_small
                          }
                          width={40}
                          height={40}
                          alt=""
                          className="rounded-full mr-2"
                        />
                        {subscription.tariff.channel.name}
                      </div>
                    </TableCell>
                    <TableCell>{subscription.user.telegram_id}</TableCell>
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
  info: string;
  channel: Channel;
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

interface PaymentData {
  id: number;
  user_id: number;
  tariff_id: number;
  payment_id: number;
  createdAt: string;
  updatedAt: string;
  is_active: boolean;
  expires_at: string;
  last_payment: string;
  is_exprible: boolean;
  is_deleted: boolean;
  user: User;
  tariff: Tariff;
}
