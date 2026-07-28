import apiClient from "@/lib/apiClient";

export interface MentorshipProfile {
  id: string;
  userId: string;
  topics: string[];
  bio: string | null;
  createdAt: string;
}

export interface EducatorListing {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mentorshipProfile: MentorshipProfile;
  rating?: { average: number | null; count: number };
}

export interface MentorshipApplication {
  id: string;
  studentId?: string;
  educatorId?: string;
  message: string;
  topic: string | null;
  status: "pending" | "accepted" | "rejected";
  rejectionReason: string | null;
  createdAt: string;
  student?: { id: string; firstName: string; lastName: string; email: string };
  educator?: { id: string; firstName: string; lastName: string };
}

export interface Mentorship {
  id: string;
  studentId: string;
  educatorId: string;
  startedAt: string;
  endedAt: string | null;
  endedBy: string | null;
  endReason: string | null;
  student: { id: string; firstName: string; lastName: string; email: string };
  educator: { id: string; firstName: string; lastName: string };
  rating?: { id: string; rating: number } | null;
}

export async function searchEducators(query?: string): Promise<EducatorListing[]> {
  const params = query ? { q: query } : {};
  const res = await apiClient.get<{ data: EducatorListing[] }>("/mentorship/educators", { params });
  return res.data.data;
}

export async function getEducator(userId: string): Promise<EducatorListing> {
  const res = await apiClient.get<{ data: EducatorListing }>(`/mentorship/educators/${userId}`);
  return res.data.data;
}

export async function createProfile(data: {
  topics: string[];
  bio?: string;
}): Promise<MentorshipProfile> {
  const res = await apiClient.post<{ data: MentorshipProfile }>("/mentorship/profile", data);
  return res.data.data;
}

export async function updateProfile(data: {
  topics?: string[];
  bio?: string;
}): Promise<MentorshipProfile> {
  const res = await apiClient.put<{ data: MentorshipProfile }>("/mentorship/profile", data);
  return res.data.data;
}

export async function removeProfile(): Promise<void> {
  await apiClient.delete("/mentorship/profile");
}

export async function getMyProfile(): Promise<MentorshipProfile> {
  const res = await apiClient.get<{ data: MentorshipProfile }>("/mentorship/profile/me");
  return res.data.data;
}

export async function applyForMentorship(
  educatorId: string,
  data: { message: string; topic?: string },
): Promise<MentorshipApplication> {
  const res = await apiClient.post<{ data: MentorshipApplication }>(
    `/mentorship/apply/${educatorId}`,
    data,
  );
  return res.data.data;
}

export async function listMyApplications(): Promise<MentorshipApplication[]> {
  const res = await apiClient.get<{ data: MentorshipApplication[] }>("/mentorship/applications");
  return res.data.data;
}

export async function listReceivedApplications(): Promise<MentorshipApplication[]> {
  const res = await apiClient.get<{ data: MentorshipApplication[] }>(
    "/mentorship/applications/received",
  );
  return res.data.data;
}

export async function acceptApplication(id: string): Promise<Mentorship> {
  const res = await apiClient.post<{ data: Mentorship }>(`/mentorship/applications/${id}/accept`);
  return res.data.data;
}

export async function rejectApplication(
  id: string,
  rejectionReason?: string,
): Promise<MentorshipApplication> {
  const res = await apiClient.post<{ data: MentorshipApplication }>(
    `/mentorship/applications/${id}/reject`,
    { rejectionReason },
  );
  return res.data.data;
}

export async function listMentorships(): Promise<Mentorship[]> {
  const res = await apiClient.get<{ data: Mentorship[] }>("/mentorship");
  return res.data.data;
}

export async function endMentorship(id: string, endReason?: string): Promise<Mentorship> {
  const res = await apiClient.post<{ data: Mentorship }>(`/mentorship/${id}/end`, { endReason });
  return res.data.data;
}

export interface MentorshipMessage {
  id: string;
  mentorshipId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: { id: string; firstName: string; lastName: string };
}

export interface MentorshipRatingData {
  average: number | null;
  count: number;
}

export async function listMessages(mentorshipId: string): Promise<MentorshipMessage[]> {
  const res = await apiClient.get<{ data: MentorshipMessage[] }>(
    `/mentorship/${mentorshipId}/messages`,
  );
  return res.data.data;
}

export async function sendMessage(
  mentorshipId: string,
  content: string,
): Promise<MentorshipMessage> {
  const res = await apiClient.post<{ data: MentorshipMessage }>(
    `/mentorship/${mentorshipId}/messages`,
    { content },
  );
  return res.data.data;
}

export async function rateEducator(mentorshipId: string, rating: number): Promise<void> {
  await apiClient.post(`/mentorship/${mentorshipId}/rate`, { rating });
}

export async function getEducatorRating(educatorId: string): Promise<MentorshipRatingData> {
  const res = await apiClient.get<{ data: MentorshipRatingData }>(
    `/mentorship/educators/${educatorId}/ratings`,
  );
  return res.data.data;
}
