import api from "./api";

export const getTasks = async (projectId: string) => {
  const response = await api.get("/tasks", {
    params: { projectId },
  });
  return response.data;
};

export const getTaskById = async (id: string) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: any) => {
  const response = await api.post("/tasks", data);
  return response.data;
};

export const updateTask = async (id: string, data: any) => {
  const response = await api.patch(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const assignTask = async (
  taskId: string,
  userId: string,
) => {
  const response = await api.patch(
    `/tasks/${taskId}/assign`,
    { userId },
  );

  return response.data;
};

export const unassignTask = async (taskId: string) => {
  const response = await api.patch(
    `/tasks/${taskId}/unassign`,
  );

  return response.data;
};