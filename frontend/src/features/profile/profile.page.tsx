import { Sidebar, SidebarProvider } from "@/shared/ui/kit/sidebar";
import { Outlet } from "react-router-dom";
import { ProfileSidebar } from "./ui/profile-sidebar";

const ProfilePage = () => {
  return (
    <div className="max-w-[1440px] w-full px-2.5 mx-auto relative">
      <SidebarProvider>
        <Sidebar className="w-1/4 absolute top-0 left-0 border-r border-slate-700">
          <ProfileSidebar />
        </Sidebar>
        <Outlet />
      </SidebarProvider>
    </div>
  );
};
export const Component = ProfilePage;
