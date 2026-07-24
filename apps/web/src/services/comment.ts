import api from "./api";

interface CreateCommentDto {
  content: string;
  authorId: string;
}

export const getComments = async (taskId: string) => {
  const response = await api.get(`/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (
  taskId: string,
  data: CreateCommentDto
) => {
  const response = await api.post(
    `/tasks/${taskId}/comments`,
    data
  );

  return response.data;
};

export const updateComment = async (
  commentId: string,
  content: string
) => {
  const response = await api.patch(`/comments/${commentId}`, {
    content,
  });

  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};