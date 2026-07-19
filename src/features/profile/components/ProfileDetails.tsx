import { Mail, School, BookOpen, Briefcase, Clock, Shield } from "lucide-react";
import type { UserProfile } from "../types/profileTypes";

interface ProfileDetailsProps {
  profile: UserProfile;
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <div className="divide-y">
      <div className="flex items-center gap-3 py-3">
        <Mail className="text-muted-foreground size-4 shrink-0" />
        <span className="text-muted-foreground text-sm">Email</span>
        <span className="text-foreground ml-auto text-sm font-medium">{profile.email}</span>
      </div>

      <div className="flex items-center gap-3 py-3">
        <Shield className="text-muted-foreground size-4 shrink-0" />
        <span className="text-muted-foreground text-sm">Role</span>
        <span className="text-foreground ml-auto text-sm font-medium capitalize">
          {profile.role}
        </span>
      </div>

      {profile.studentProfile && (
        <>
          <div className="flex items-center gap-3 py-3">
            <School className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">School</span>
            <span className="text-foreground ml-auto text-sm font-medium">
              {profile.studentProfile.schoolName}
            </span>
          </div>
          <div className="flex items-center gap-3 py-3">
            <BookOpen className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">Grade</span>
            <span className="text-foreground ml-auto text-sm font-medium">
              {profile.studentProfile.grade}
            </span>
          </div>
        </>
      )}

      {profile.educatorProfile && (
        <>
          <div className="flex items-center gap-3 py-3">
            <School className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">
              {profile.educatorProfile.isIndependent ? "Status" : "Organization"}
            </span>
            <span className="text-foreground ml-auto text-sm font-medium">
              {profile.educatorProfile.isIndependent
                ? "Independent Educator"
                : profile.educatorProfile.organizationName}
            </span>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Briefcase className="text-muted-foreground size-4 shrink-0" />
            <span className="text-muted-foreground text-sm">Expertise</span>
            <div className="ml-auto flex flex-wrap justify-end gap-1">
              {profile.educatorProfile.expertiseAreas.map((area) => (
                <span
                  key={area}
                  className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
          {profile.educatorProfile.yearsOfExperience != null && (
            <div className="flex items-center gap-3 py-3">
              <Clock className="text-muted-foreground size-4 shrink-0" />
              <span className="text-muted-foreground text-sm">Experience</span>
              <span className="text-foreground ml-auto text-sm font-medium">
                {profile.educatorProfile.yearsOfExperience} years
              </span>
            </div>
          )}
          <div className="py-3">
            <p className="text-muted-foreground mb-2 text-sm">Bio</p>
            <p className="text-foreground text-sm leading-relaxed">{profile.educatorProfile.bio}</p>
          </div>
        </>
      )}

      {!profile.studentProfile && !profile.educatorProfile && (
        <div className="flex items-center gap-3 py-3">
          <Shield className="text-muted-foreground size-4 shrink-0" />
          <span className="text-muted-foreground text-sm">Account Type</span>
          <span className="text-foreground ml-auto text-sm font-medium">
            Platform Administrator
          </span>
        </div>
      )}
    </div>
  );
}
