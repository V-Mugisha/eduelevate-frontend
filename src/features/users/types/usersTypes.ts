export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  role: { id: string; name: "student" | "educator" | "admin" };
  studentProfile?: { schoolName: string; grade: string } | null;
  educatorProfile?: { organizationName: string | null; expertiseAreas: string[] } | null;
}

export interface UserDetail {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  role: { id: string; name: "student" | "educator" | "admin" };
  studentProfile?: { id: string; schoolName: string; grade: string } | null;
  educatorProfile?: {
    id: string;
    isIndependent: boolean;
    organizationName: string | null;
    expertiseAreas: string[];
    yearsOfExperience: number | null;
    bio: string | null;
  } | null;
}

export interface UserListResponse {
  data: UserSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserPayload {
  role: "student" | "educator" | "admin";
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  schoolName?: string;
  grade?: string;
  isIndependent?: boolean;
  organizationName?: string;
  expertiseAreas?: string[];
  yearsOfExperience?: number;
  bio?: string;
}

export interface UpdateUserPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  roleId?: string;
  schoolName?: string;
  grade?: string;
  isIndependent?: boolean;
  organizationName?: string | null;
  expertiseAreas?: string[];
  yearsOfExperience?: number | null;
  bio?: string;
}
