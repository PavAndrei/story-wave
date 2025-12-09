import { ROUTES } from "@/shared/model/routes";
import { useMyProfile } from "@/shared/model/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import { Button } from "@/shared/ui/kit/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/kit/sidebar";
import {
  FileUser,
  PanelLeftClose,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";
import { href, Link, Outlet } from "react-router-dom";

const ProfilePage = () => {
  const { userData } = useMyProfile();

  return (
    <main className="max-w-[1440px] w-full px-2.5 mx-auto relative overflow-x-hidden">
      <div>
        Profile Page {userData?.username}
        <SidebarProvider>
          <Sidebar className="w-1/4 absolute top-0 left-0 border-r border-slate-700">
            <SidebarHeader className="bg-slate-200 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={userData?.avatarUrl} />
                    <AvatarFallback>
                      <User className="text-cyan-700 size-8" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-slate-700 font-semibold text-2xl">
                    {userData?.username}
                  </span>
                </div>
                <Button
                  aria-label="close sidebar"
                  asChild
                  className="bg-cyan-700 hover:bg-cyan-600 hover:text-slate-200 cursor-pointer size-10"
                >
                  <SidebarTrigger>
                    <PanelLeftClose />
                  </SidebarTrigger>
                </Button>
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-slate-200">
              <SidebarGroup className="flex flex-row gap-2 font-medium text-slate-700">
                <FileUser className="size-6" />
                <Link to={href(ROUTES.PROFILE)}>Overview</Link>
              </SidebarGroup>
              <SidebarGroup className="flex flex-row gap-2 font-medium text-slate-700">
                <ShieldCheck className="size-6" />
                <Link to={href(ROUTES.PROFILE_SECURITY)}>Security</Link>
              </SidebarGroup>
              <SidebarGroup className="flex flex-row gap-2 font-medium text-slate-700">
                <Settings className="size-6" />
                <Link to={href(ROUTES.PROFILE_SETTINGS)}>Settings</Link>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="bg-slate-200">Log Out</SidebarFooter>
          </Sidebar>
          <Outlet />
        </SidebarProvider>
      </div>
    </main>
  );
};
export const Component = ProfilePage;
