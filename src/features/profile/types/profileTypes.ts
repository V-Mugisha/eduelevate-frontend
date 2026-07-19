export interface StudentProfile {
  id: string;
  schoolName: string;
  grade: string;
}

export interface EducatorProfile {
  id: string;
  isIndependent: boolean;
  organizationName: string | null;
  expertiseAreas: string[];
  yearsOfExperience: number | null;
  bio: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  studentProfile: StudentProfile | null;
  educatorProfile: EducatorProfile | null;
}

export interface ProfileResponse {
  data: UserProfile;
}
