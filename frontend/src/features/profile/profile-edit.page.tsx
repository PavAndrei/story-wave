import { Button } from "@/shared/ui/kit/button";
import { CardDescription, CardTitle } from "@/shared/ui/kit/card";
import { ProfileLayout } from "./ui/profile-layout";
import { useMyProfile } from "@/shared/model/user";
import { ProfileEditForm } from "./ui/profile-edit-form";

export const ProfileEditPage = () => {
  const { userData, pending } = useMyProfile();

  if (pending) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <ProfileLayout
      title="Edit Profile"
      description="Update your account information and personalize your profile."
      header={<></>}
      content={<ProfileEditForm />}
      footerText={
        <div className="pt-4 w-full text-center">
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-red-400 pb-3">
            This action is irreversible.
          </CardDescription>

          <Button className="bg-red-600 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer">
            Delete Account
          </Button>
        </div>
      }
    />
  );
};

export const Component = ProfileEditPage;
