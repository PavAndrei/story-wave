import { ROUTES } from "@/shared/model/routes";
import { useMyProfile } from "@/shared/model/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/shared/ui/kit/sidebar";
import { FileUser, Settings, ShieldCheck, User } from "lucide-react";
import { href, Link } from "react-router-dom";

export const ProfileSidebar = () => {
  const { userData } = useMyProfile();

  return (
    <>
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
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-slate-200">
        <SidebarGroup className="flex flex-row gap-2 font-medium text-slate-700 py-4">
          <FileUser className="size-6" />
          <Link to={href(ROUTES.PROFILE)}>Overview</Link>
        </SidebarGroup>
        <SidebarGroup className="flex flex-row gap-2 font-medium text-slate-700 py-4">
          <ShieldCheck className="size-6" />
          <Link to={href(ROUTES.PROFILE_SECURITY)}>Security</Link>
        </SidebarGroup>
        <SidebarGroup className="flex flex-row gap-2 font-medium text-slate-700 py-4">
          <Settings className="size-6" />
          <Link to={href(ROUTES.PROFILE_SETTINGS)}>Settings</Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-slate-200">Log Out</SidebarFooter>
    </>
  );
};
