import api from "./api";

export const getProjectStats = async (projectId: string) => {
  const response = await api.get(`/dashboard/project/${projectId}`);
  return response.data;
};

export const getUserStats = async (userId: string) => {
  const response = await api.get(`/dashboard/user/${userId}`);
  return response.data;
};

export const getRecentActivities = async (projectId: string) => {
  const response = await api.get(`/dashboard/activity/${projectId}`);
  return response.data;
};