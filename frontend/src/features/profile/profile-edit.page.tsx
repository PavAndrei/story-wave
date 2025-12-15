import { ProfileLayout } from "./ui/profile-layout";
import { useMyProfile } from "@/shared/model/user";
import { ProfileEditForm } from "./ui/profile-edit-form";
import { ProfileDeleteSection } from "./ui/profile-delete-section";

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
      footerText={<ProfileDeleteSection />}
    />
  );
};

export const Component = ProfileEditPage;
