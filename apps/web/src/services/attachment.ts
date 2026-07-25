import api from "./api";

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploaderId: string;
  uploadedAt: string;
  uploader?: { id: string; name: string; email: string };
}

export const getAttachments = async (taskId: string): Promise<Attachment[]> => {
  const response = await api.get(`/tasks/${taskId}/attachments`);
  return response.data;
};

export const uploadAttachment = async (
  taskId: string,
  file: File,
): Promise<Attachment> => {
  const data = new FormData();
  data.append("file", file);

  const response = await api.post(`/tasks/${taskId}/attachments`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteAttachment = async (attachmentId: string) => {
  await api.delete(`/attachments/${attachmentId}`);
};
