import api from "./api";

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  task: { id: string; title: string; projectId: string };
  dependsOn: { id: string; title: string; projectId: string };
}

export const getDependencies = async (): Promise<TaskDependency[]> => {
  const response = await api.get("/task-dependencies");
  return response.data;
};

export const addDependency = async (taskId: string, dependsOnTaskId: string) => {
  await api.post("/task-dependencies", { taskId, dependsOnTaskId });
};

export const removeDependency = async (dependencyId: string) => {
  await api.delete(`/task-dependencies/${dependencyId}`);
};
