import {
  BaggageClaim,
  Calculator,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

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

// Menu items.
const items = [
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
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User2,
  },
];

export function AppSidebar() {
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
                      key={item.title}
                      to={item.url}
                      //           className={`flex items-center gap-2 p-2 rounded transition-colors
                      //   ${
                      //     onmouseenter
                      //       ? "bg-red-500  text-black"
                      //       : "text-black hover:bg-red-500 hover:text-white"
                      //   }
                      // `}

                      className={({ isActive }) =>
                        `flex items-center gap-2 p-2 rounded transition-colors ${
                          isActive
                            ? "bg-red-500 text-white" // active route
                            : "text-black hover:bg-red-500 hover:text-white"
                        }`
                      }
                    >
                      <item.icon />
                      {item.title}
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
