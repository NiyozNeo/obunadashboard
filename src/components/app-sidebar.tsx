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
    url: "#",
    icon: Home,
  },
  {
    title: "History Payments",
    url: "/history",
    icon: History,
  },
  {
    title: "Subscriptions",
    url: "#",
    icon: UserCheck2,
  },
  {
    title: "Users",
    url: "#",
    icon: Users2,
  },
  {
    title: "Channels",
    url: "#",
    icon: TvMinimal,
  },
  {
    title: "Tariffs",
    url: "#",
    icon: CircleDollarSign,
  },
  {
    title: "Reports",
    url: "#",
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
