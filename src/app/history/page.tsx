"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { AppSidebar } from "@/components/app-sidebar";
import Image from "next/image";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [histories, setHistory] = useState<Subscription[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const offset = (currentPage - 1) * usersPerPage;
        let url = `${process.env.BACKEND_URL}/admin/payment_history?limit=${usersPerPage}&offset=${offset}`;
        if (startDate) {
          url += `&start_date=${startDate}`;
        }
        if (endDate) {
          url += `&end_date=${endDate}`;
        }
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("session")}`,
          },
        });

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setHistory(data.data);
        setTotalItems(data.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, startDate, endDate]);

  const totalPages = Math.ceil(totalItems / usersPerPage);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <SidebarInset>
          <h1 className="text-2xl font-bold mb-5">Tolovlar tarixi</h1>
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="User">User</SelectItem>
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
                  <TableHead>Value</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>KanalId</TableHead>
                  <TableHead>Tarif</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {histories.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell className="font-medium">{history.id}</TableCell>
                    <TableCell>{history.value}</TableCell>
                    <TableCell>{history.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Image
                          src={
                            process.env.BACKEND_URL +
                            "/api/images/" +
                            history.channel.photo_small
                          }
                          width={40}
                          height={40}
                          alt=""
                          className="rounded-full mr-2"
                        />
                        {history.channel.name}
                      </div>
                    </TableCell>
                    <TableCell>{history.tariff.name}</TableCell>
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
}

interface Subscription {
  id: number;
  user_id: number;
  subscription_id: number;
  tariff_id: number;
  payment_id: number;
  value: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  expires_at: string;
  transaction_id: string;
  channel_id: number;
  user: User;
  channel: Channel;
  tariff: Tariff;
}