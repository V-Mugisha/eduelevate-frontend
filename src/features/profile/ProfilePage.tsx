import { Link } from "react-router-dom";
import { Pencil, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingBubbles from "@/components/shared/LoadingBubbles";
import useProfile from "./hooks/useProfile";
import ProfileHeader from "./components/ProfileHeader";
import ProfileDetails from "./components/ProfileDetails";

export default function ProfilePage() {
  const { profile, isLoading, error } = useProfile();

  if (isLoading) {
    return <LoadingBubbles size="lg" />;
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <p className="text-muted-foreground">{error ?? "Profile not found."}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-10 lg:px-8">
      <div className="bg-card rounded-xl border p-6 shadow-sm sm:p-8">
        <ProfileHeader profile={profile} />

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-foreground text-lg font-semibold">Account Details</h2>
            <div className="flex gap-2">
              <Link to="/profile/change-password">
                <Button variant="outline" size="sm">
                  <Key className="mr-1.5 size-4" />
                  Change Password
                </Button>
              </Link>
              <Link to="/profile/edit">
                <Button variant="outline" size="sm">
                  <Pencil className="mr-1.5 size-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
          <ProfileDetails profile={profile} />
        </div>
      </div>
    </div>
  );
}
