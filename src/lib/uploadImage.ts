import apiClient from "./apiClient";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<{ url: string }>("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url;
}
