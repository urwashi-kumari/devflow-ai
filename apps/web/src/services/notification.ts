import api from "./api";

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
}

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const response = await api.get(`/notifications/${userId}`);
  return response.data;
};

export const markAsRead = async (notificationId: string) => {
  await api.patch(`/notifications/${notificationId}/read`);
};

export const deleteNotification = async (notificationId: string) => {
  await api.delete(`/notifications/${notificationId}`);
};
