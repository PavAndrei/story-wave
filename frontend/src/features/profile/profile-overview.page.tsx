import { ROUTES } from "@/shared/model/routes";
import { useMyProfile } from "@/shared/model/user";
import { Avatar, AvatarImage } from "@/shared/ui/kit/avatar";
import { Button } from "@/shared/ui/kit/button";
import { CardDescription, CardTitle } from "@/shared/ui/kit/card";
import { User } from "lucide-react";
import { Link, href } from "react-router-dom";
import { ProfileLayout } from "./ui/profile-layout";
import { formatDate } from "@/shared/model/date";

const ProfileOverviewPage = () => {
  const { userData, pending } = useMyProfile();

  if (pending) return <div>Loading...</div>;

  if (!userData) return <div>User not found</div>;

  return (
    <ProfileLayout
      title="Profile Overview"
      description="You can see how your profile looks like."
      header={
        <>
          <Avatar className="flex items-center justify-center w-24 h-24 rounded-full object-cover border-4 border-cyan-700 shadow-md">
            {userData?.avatarUrl ? (
              <AvatarImage src={userData?.avatarUrl} />
            ) : (
              <User className="text-cyan-700 size-12" />
            )}
          </Avatar>

          <div>
            <CardTitle className="text-slate-700 text-xl font-semibold">
              {userData.username}
            </CardTitle>

            <span className="text-slate-500 text-xs">
              registered on {formatDate(userData.createdAt)}
            </span>

            <CardDescription className="text-slate-500">
              {userData.email}
            </CardDescription>
          </div>
        </>
      }
      content={
        <>
          {userData.bio ? (
            <p className="mt-4 text-slate-500">{userData.bio}</p>
          ) : (
            <p className="mt-4 text-slate-500 text-center w-full">
              This user has not added a bio yet. Add one now!
            </p>
          )}
        </>
      }
      footerText={
        <Button
          asChild
          className="bg-cyan-700 hover:bg-cyan-600 text-white px-6 rounded-xl cursor-pointer"
        >
          <Link to={href(ROUTES.PROFILE_EDIT)}>Edit Profile</Link>
        </Button>
      }
    />
  );
};

export const Component = ProfileOverviewPage;
