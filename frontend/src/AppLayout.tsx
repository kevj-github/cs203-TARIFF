import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
// import { AppSidebar } from "@/components";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen bg-[#efebeb]">
        <AppSidebar />
        <main className="flex-1 flex flex-col w-full p-6 my-2 mr-2 bg-white rounded-md">
          <div className="flex items-center justify-between mb-4">
            <SidebarTrigger />
          </div>
          <div className="flex-1 overflow-auto w-full ">
            <Outlet />
          </div>
          {/* <SidebarTrigger className="object-top-left" /> */}
          {/* <Outlet /> */}
        </main>
      </div>
    </SidebarProvider>
  );
}
