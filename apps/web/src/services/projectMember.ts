import api from "./api";

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  user: User;
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const getMembers = async (projectId: string): Promise<ProjectMember[]> => {
  const response = await api.get(`/projects/${projectId}/members`);
  return response.data;
};

export const addMember = async (projectId: string, userId: string, role: ProjectRole) => {
  await api.post(`/projects/${projectId}/members`, { userId, role });
};

export const updateMemberRole = async (projectId: string, memberId: string, role: ProjectRole) => {
  await api.patch(`/projects/${projectId}/members/${memberId}/role`, { role });
};

export const removeMember = async (projectId: string, memberId: string) => {
  await api.delete(`/projects/${projectId}/members/${memberId}`);
};
