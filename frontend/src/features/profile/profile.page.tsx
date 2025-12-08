import { ROUTES } from "@/shared/model/routes";
import { useMyProfile } from "@/shared/model/user";
import { href, Link, Outlet } from "react-router-dom";

const ProfilePage = () => {
  const { userData } = useMyProfile();

  return (
    <main>
      Profile Page {userData?.username}
      <nav>
        <Link to={href(ROUTES.PROFILE)}>Overview</Link>
        <Link to={href(ROUTES.PROFILE_SECURITY)}>Security</Link>
        <Link to={href(ROUTES.PROFILE_SETTINGS)}>Settings</Link>
      </nav>
      <Outlet />
    </main>
  );
};
export const Component = ProfilePage;
