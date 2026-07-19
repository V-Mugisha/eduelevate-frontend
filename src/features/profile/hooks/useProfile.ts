import { useState, useEffect, useCallback } from "react";
import type { UserProfile } from "../types/profileTypes";
import * as profileService from "../services/profileService";

export default function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileService.getProfile();
      setProfile(response.data);
    } catch {
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleUpdateBasicInfo(data: { firstName: string; lastName: string }) {
    setError(null);
    try {
      const response = await profileService.updateProfile(data);
      setProfile(
        (previous) =>
          previous && {
            ...previous,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
          },
      );
      return true;
    } catch {
      setError("Failed to update profile. Please try again.");
      return false;
    }
  }

  async function handleUpdateStudentProfile(data: { schoolName: string; grade: string }) {
    setError(null);
    try {
      await profileService.updateStudentProfile(data);
      setProfile(
        (previous) =>
          previous && {
            ...previous,
            studentProfile: { ...previous.studentProfile!, ...data },
          },
      );
      return true;
    } catch {
      setError("Failed to update profile. Please try again.");
      return false;
    }
  }

  async function handleUpdateEducatorProfile(data: {
    bio: string;
    expertiseAreas: string[];
    yearsOfExperience?: number;
    isIndependent: boolean;
    organizationName?: string;
  }) {
    setError(null);
    try {
      await profileService.updateEducatorProfile(data);
      setProfile(
        (previous) =>
          previous && {
            ...previous,
            educatorProfile: { ...previous.educatorProfile!, ...data },
          },
      );
      return true;
    } catch {
      setError("Failed to update profile. Please try again.");
      return false;
    }
  }

  async function handleChangePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) {
    setError(null);
    try {
      await profileService.changePassword(data);
      return { success: true };
    } catch {
      setError("Failed to change password. Please check your current password.");
      return { success: false };
    }
  }

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    handleUpdateBasicInfo,
    handleUpdateStudentProfile,
    handleUpdateEducatorProfile,
    handleChangePassword,
  };
}
