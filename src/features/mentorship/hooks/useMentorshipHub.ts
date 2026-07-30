import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import useAuth from "@/features/auth/hooks/useAuth";
import useDebounce from "@/hooks/useDebounce";
import * as mentorshipService from "../services/mentorshipService";
import type {
  EducatorListing,
  MentorshipApplication,
  Mentorship,
} from "../services/mentorshipService";

export default function useMentorshipHub() {
  const { user } = useAuth();
  const isEducatorOrAdmin = user?.role === "educator" || user?.role === "admin";

  const [activeTab, setActiveTab] = useState<"hub" | "applications" | "active">("hub");
  const [educators, setEducators] = useState<EducatorListing[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(true);

  const [showOptIn, setShowOptIn] = useState(false);
  const [topics, setTopics] = useState<string[]>([""]);
  const [bio, setBio] = useState("");
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOptingOut, setIsOptingOut] = useState(false);

  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [activeMentorships, setActiveMentorships] = useState<Mentorship[]>([]);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const [applicationsLoaded, setApplicationsLoaded] = useState(false);
  const [activeLoaded, setActiveLoaded] = useState(false);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [isSavingApplications, setIsSavingApplications] = useState(false);
  const [isSavingActive, setIsSavingActive] = useState(false);

  useEffect(() => {
    mentorshipService
      .searchEducators(debouncedSearch || undefined)
      .then((results) => {
        setEducators(results);
        if (isEducatorOrAdmin && user) {
          const found = results.find((e) => e.id === user.id);
          setIsOptedIn(!!found);
        }
      })
      .catch(() => setEducators([]))
      .finally(() => setIsLoading(false));
  }, [isEducatorOrAdmin, debouncedSearch, user]);

  const handleOptIn = useCallback(async () => {
    const validTopics = topics.filter((t) => t.trim());
    if (validTopics.length === 0) return;
    setIsSaving(true);
    try {
      if (isOptedIn) {
        await mentorshipService.updateProfile({ topics: validTopics, bio: bio || undefined });
        toast.success("Profile updated.");
      } else {
        await mentorshipService.createProfile({ topics: validTopics, bio: bio || undefined });
        setIsOptedIn(true);
        toast.success("You are now listed in the mentorship hub.");
      }
      setShowOptIn(false);
      setTopics([""]);
      setBio("");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  }, [topics, bio, isOptedIn]);

  const handleOptOut = useCallback(async () => {
    if (!confirm("Remove yourself from the mentorship hub?")) return;
    setIsOptingOut(true);
    try {
      await mentorshipService.removeProfile();
      setIsOptedIn(false);
      setShowOptIn(false);
      toast.success("Removed from mentorship hub.");
    } catch {
      toast.error("Failed to remove profile.");
    } finally {
      setIsOptingOut(false);
    }
  }, []);

  const loadApplications = useCallback(async () => {
    if (applicationsLoaded) return;
    setIsLoadingApplications(true);
    try {
      const apps = isEducatorOrAdmin
        ? await mentorshipService.listReceivedApplications()
        : await mentorshipService.listMyApplications();
      setApplications(apps);
      setApplicationsLoaded(true);
    } catch {
      toast.error("Failed to load applications.");
    } finally {
      setIsLoadingApplications(false);
    }
  }, [isEducatorOrAdmin, applicationsLoaded]);

  const loadActive = useCallback(async () => {
    if (activeLoaded) return;
    setIsLoadingActive(true);
    try {
      const list = await mentorshipService.listMentorships();
      setActiveMentorships(list);
      setActiveLoaded(true);
    } catch {
      toast.error("Failed to load mentorships.");
    } finally {
      setIsLoadingActive(false);
    }
  }, [activeLoaded]);

  const handleTabChange = useCallback(
    (tab: "hub" | "applications" | "active") => {
      setActiveTab(tab);
      if (tab === "applications") loadApplications();
      if (tab === "active") loadActive();
    },
    [loadApplications, loadActive],
  );

  const handleAccept = useCallback(async (id: string) => {
    setIsSavingApplications(true);
    try {
      await mentorshipService.acceptApplication(id);
      toast.success("Application accepted.");
      setApplicationsLoaded(false);
      setActiveLoaded(false);
      setApplications([]);
      setActiveMentorships([]);
    } catch (e: unknown) {
      toast.error(
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Failed to accept.",
      );
    } finally {
      setIsSavingApplications(false);
    }
  }, []);

  const handleReject = useCallback(
    async (id: string) => {
      setIsSavingApplications(true);
      try {
        await mentorshipService.rejectApplication(id, rejectionReason || undefined);
        toast.success("Application rejected.");
        setRejectingId(null);
        setRejectionReason("");
        setApplicationsLoaded(false);
        setApplications([]);
        loadApplications();
      } catch {
        toast.error("Failed to reject.");
      } finally {
        setIsSavingApplications(false);
      }
    },
    [rejectionReason, loadApplications],
  );

  const handleEndMentorship = useCallback(
    async (id: string) => {
      if (!confirm("End this mentorship?")) return;
      setIsSavingActive(true);
      try {
        await mentorshipService.endMentorship(id);
        toast.success("Mentorship ended.");
        setActiveLoaded(false);
        setActiveMentorships([]);
        loadActive();
      } catch {
        toast.error("Failed to end mentorship.");
      } finally {
        setIsSavingActive(false);
      }
    },
    [loadActive],
  );

  const addTopic = useCallback(() => setTopics((prev) => [...prev, ""]), []);
  const removeTopic = useCallback((index: number) => {
    setTopics((prev) => prev.filter((_, j) => j !== index));
  }, []);
  const updateTopic = useCallback((index: number, value: string) => {
    setTopics((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  return {
    user,
    isEducatorOrAdmin,
    activeTab,
    educators,
    search,
    setSearch,
    isLoading,
    showOptIn,
    setShowOptIn,
    topics,
    setTopics,
    bio,
    setBio,
    isOptedIn,
    isSaving,
    isOptingOut,
    applications,
    activeMentorships,
    rejectionReason,
    setRejectionReason,
    rejectingId,
    setRejectingId,
    isLoadingApplications,
    isLoadingActive,
    isSavingApplications,
    isSavingActive,
    handleOptIn,
    handleOptOut,
    handleTabChange,
    handleAccept,
    handleReject,
    handleEndMentorship,
    addTopic,
    removeTopic,
    updateTopic,
  };
}
