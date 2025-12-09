import { ROUTES } from "@/shared/model/routes";
import { useMyProfile } from "@/shared/model/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import { Button } from "@/shared/ui/kit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/kit/card";
import { User } from "lucide-react";
import { Link, href } from "react-router-dom";

const ProfileOverviewPage = () => {
  const { userData, pending } = useMyProfile();

  if (pending) return <div>Loading...</div>;

  if (!userData) return <div>User not found</div>;

  return (
    <Card className="w-full max-w-md h-full mx-auto border border-slate-700 shadow-sm rounded-2xl bg-slate-200 flex flex-col gap-8">
      <CardHeader className="flex flex-col items-center text-center gap-4">
        <Avatar className="w-24 h-24 rounded-full object-cover border-4 border-cyan-700 shadow-md">
          <AvatarImage src={userData?.avatarUrl} />
          <AvatarFallback>
            <User className="text-cyan-700 size-12" />
          </AvatarFallback>
        </Avatar>

        <div>
          <CardTitle className="text-slate-700 text-xl font-semibold">
            {userData.username}
          </CardTitle>

          <CardDescription className="text-slate-500">
            {userData.email}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="text-slate-700 text-sm leading-relaxed">
        {userData.bio ? (
          <p className="mt-4 text-slate-600">{userData.bio}</p>
        ) : (
          <p className="mt-4 text-slate-500 text-center w-full">
            This user has not added a bio yet. Add one now!
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-center pt-6">
        <Button
          asChild
          className="bg-cyan-700 hover:bg-cyan-600 text-white px-6 rounded-xl cursor-pointer"
        >
          <Link to={href(ROUTES.PROFILE_EDIT)}>Edit Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const Component = ProfileOverviewPage;
