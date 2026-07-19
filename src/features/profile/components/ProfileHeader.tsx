import type { UserProfile } from "../types/profileTypes";

const userAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`;

interface ProfileHeaderProps {
  profile: UserProfile;
}

const roleLabel: Record<string, string> = {
  student: "Student",
  educator: "Educator",
  admin: "Administrator",
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      <img
        src={userAvatarUrl(profile.id)}
        alt=""
        className="bg-muted size-24 rounded-full sm:size-28"
      />
      <div className="text-center sm:text-left">
        <h1 className="text-foreground text-2xl font-bold">
          {profile.firstName} {profile.lastName}
        </h1>
        <span className="bg-primary/10 text-primary mt-1 inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium">
          {roleLabel[profile.role] ?? profile.role}
        </span>
      </div>
    </div>
  );
}
