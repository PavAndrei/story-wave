import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/kit/avatar";
import { Button } from "@/shared/ui/kit/button";
import { CardDescription, CardTitle } from "@/shared/ui/kit/card";
import { ProfileLayout } from "./ui/profile-layout";
import { User } from "lucide-react";
import { useMyProfile } from "@/shared/model/user";
import { ProfileEditForm } from "./ui/profile-edit-form";

export const ProfileEditPage = () => {
  const navigate = useNavigate();

  const { userData, pending } = useMyProfile();
  // const updateProfile = useUpdateProfile();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [error, setError] = useState("");

  if (pending) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  return (
    <ProfileLayout
      title="Edit Profile"
      description="Update your account information and personalize your profile."
      header={
        <>
          <Avatar className="w-24 h-24 border-4 rounded-full border-cyan-700 shadow-md">
            <AvatarImage src={avatarPreview || undefined} />
            <AvatarFallback>
              <User className="text-cyan-700 size-12" />
            </AvatarFallback>
          </Avatar>

          <Button className="bg-cyan-700 hover:bg-cyan-600 text-white px-4 py-2 rounded-xl cursor-pointer relative">
            <label className="cursor-pointer">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </Button>
        </>
      }
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
