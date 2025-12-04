import { Button } from "@/shared/ui/kit/button";
import { Logo } from "./logo";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/shared/ui/kit/navigation-menu";
import { href, Link } from "react-router-dom";

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
  return (
    <header className="bg-slate-200 py-5 border-b border-slate-700">
      <div className="max-w-[1440px] px-2.5 mx-auto flex justify-between items-center">
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
        <div className="flex items-center gap-2.5">
          <Link to={href("/login")}>
            <Button
              aria-label="log in"
              className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
            >
              Log in
            </Button>
          </Link>
          <Link to={href("/register")}>
            <Button
              aria-label="create an account"
              className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 active:scale-95"
            >
              Create account
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
