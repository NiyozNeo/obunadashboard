import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CircleDollarSign,
  FileChartColumn,
  History,
  Home,
  TvMinimal,
  UserCheck2,
  Users2,
} from "lucide-react";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "History Payments",
    url: "/history",
    icon: History,
  },
  {
    title: "Subscriptions",
    url: "/subscriptions",
    icon: UserCheck2,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users2,
  },
  {
    title: "Channels",
    url: "/channels",
    icon: TvMinimal,
  },
  {
    title: "Tariffs",
    url: "/tariffs",
    icon: CircleDollarSign,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileChartColumn,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
