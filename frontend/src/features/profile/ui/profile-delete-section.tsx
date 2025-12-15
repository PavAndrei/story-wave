import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/kit/alert-dialog";
import { Button } from "@/shared/ui/kit/button";
import { CardDescription, CardTitle } from "@/shared/ui/kit/card";
import { useDeleteProfile } from "../model/use-delete-profile";

export const ProfileDeleteSection = () => {
  const { deleteProfile, isPending } = useDeleteProfile();
  return (
    <div className="pt-4 w-full text-center">
      <CardTitle className="text-red-600">Danger Zone</CardTitle>
      <CardDescription className="text-red-400 pb-3">
        This action is irreversible.
      </CardDescription>
      <AlertDialog>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-semibold text-center text-slate-700">
              Are you sure about <br /> deleting your profile?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-700 text-center">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers completely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mx-auto flex gap-6">
            <AlertDialogCancel asChild>
              <Button className="cursor-pointer bg-cyan-700 text-slate-200 font-medium text-base py-2 px-4 hover:bg-cyan-600 hover:text-slate-200 active:scale-95 ml-auto mr-0 flex gap-2">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                className="transition-colors duration-200 ease-in-out bg-red-700 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer"
                onClick={() => deleteProfile()}
              >
                Yes, delete my account
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <AlertDialogTrigger asChild>
          <Button
            disabled={isPending}
            className="transition-colors duration-200 ease-in-out bg-red-700 hover:bg-red-500 text-white rounded-xl px-6 cursor-pointer"
          >
            Delete Account
          </Button>
        </AlertDialogTrigger>
      </AlertDialog>
    </div>
  );
};
