import apiClient from "@/lib/apiClient";
import type { Certificate } from "../types/coursesTypes";

export async function generateCertificate(courseId: string): Promise<Certificate> {
  const res = await apiClient.post<{ data: Certificate }>(`/courses/${courseId}/certificate`);
  return res.data.data;
}

export async function getCertificate(id: string): Promise<Certificate> {
  const res = await apiClient.get<{ data: Certificate }>(`/certificates/${id}`);
  return res.data.data;
}

export async function getCertificateByCourse(courseId: string): Promise<Certificate | null> {
  const res = await apiClient.get<{ data: Certificate | null }>(`/courses/${courseId}/certificate`);
  return res.data.data;
}

export async function listCertificates(): Promise<Certificate[]> {
  const res = await apiClient.get<{ data: Certificate[] }>("/certificates");
  return res.data.data;
}
