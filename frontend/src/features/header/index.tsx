import { Button } from "@/shared/ui/kit/button";
import { Logo } from "./logo";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/shared/ui/kit/navigation-menu";
import { href, Link } from "react-router-dom";
import { ROUTES } from "@/shared/model/routes";
import { useSession } from "@/shared/model/session";
import { useLogout } from "@/shared/api/use-logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import { useMyProfile } from "@/shared/model/user";
import { User } from "lucide-react";

const navigationMenuItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Blogs",
    href: "/posts",
  },
  {
    label: "Editor",
    href: "/create-post",
  },
];

export const AppHeader = () => {
  const { sessions, isLoading } = useSession();
  const { logout, isPending: isLogoutPending } = useLogout();
  const { userData } = useMyProfile();

  return (
    <header className="bg-slate-200 py-5 border-b border-slate-700">
      <div className="max-w-[1440px] px-2.5 mx-auto flex items-center">
        <Logo />
        <NavigationMenu>
          <NavigationMenuList>
            {navigationMenuItems.map((item) => (
              <NavigationMenuItem key={item.href} araia-label={item.label}>
                <NavigationMenuLink
                  asChild
                  className="hover:bg-cyan-600 active:scale-95 focus:bg-cyan-700 hover:text-slate-200 focus:text-slate-200 text-base"
                >
                  <Link className="font-medium" to={href(item.href)}>
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {isLoading ? (
          <div className="min-w-[90px] h-10 rounded ml-auto mr-0" />
        ) : sessions ? (
          <div className="flex items-center gap-2.5 mr-0 ml-auto">
            <Button
              aria-label="profile link"
              asChild
              className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95 ml-auto mr-0 flex gap-2"
            >
              <Link to={href(ROUTES.PROFILE)}>
                <Avatar className="size-6">
                  <AvatarImage src={userData?.avatarUrl} />
                  <AvatarFallback>
                    <User className="text-cyan-700 size-5" />
                  </AvatarFallback>
                </Avatar>
                {userData?.username}
              </Link>
            </Button>
            <Button
              onClick={() => logout()}
              disabled={isLogoutPending}
              aria-label="log out"
              className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95 ml-auto mr-0"
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 mr-0 ml-auto">
            <Link to={href(ROUTES.LOGIN)}>
              <Button
                aria-label="log in"
                className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
              >
                Log in
              </Button>
            </Link>
            <Link to={href(ROUTES.REGISTER)}>
              <Button
                aria-label="create an account"
                className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
              >
                Create account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
