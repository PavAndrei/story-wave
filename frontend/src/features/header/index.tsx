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
    label: "Articles",
    href: "/articles",
  },
  {
    label: "Editor",
    href: "/editor",
  },
];

export const AppHeader = () => {
  const { sessions, isLoading } = useSession();

  const { logout, isPending: isLogoutPending } = useLogout();

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
          <Button
            onClick={() => logout()}
            disabled={isLogoutPending}
            aria-label="log out"
            className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95 ml-auto mr-0"
          >
            Log out
          </Button>
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
