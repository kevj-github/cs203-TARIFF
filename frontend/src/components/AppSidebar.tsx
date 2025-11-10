import {
  BaggageClaim,
  Calculator,
  Home,
  Settings,
  User2,
  FileSpreadsheet,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { getUser } from "@/lib/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Base menu items (common to all users)
const baseItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Product",
    url: "/product",
    icon: BaggageClaim,
  },
  {
    title: "Calculator",
    url: "/calculator",
    icon: Calculator,
  },
  {
    title: "History",
    url: "/calculations",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
    title: "Bulk Upload",
    url: "/bulk-upload",
    icon: FileSpreadsheet,
  },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  {
    title: "Profile",
    url: "/profile",
    icon: User2,
  },
];

export function AppSidebar() {
  const user = getUser();
  const isAdmin = user?.role === "ADMIN";

  // If admin → include the Rules menu
  const items = isAdmin
    ? [...baseItems, { title: "Rules", url: "/admin/rules", icon: Settings }]
    : baseItems;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded transition-colors ${
                          isActive
                            ? "bg-red-500 text-white"
                            : "text-black hover:bg-red-500 hover:text-white"
                        }`
                      }
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
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
