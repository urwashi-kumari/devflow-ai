import { useEffect, useState } from "react";
import * as commentService from "../services/comment";

export default function useComments(taskId: string) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshComments = async () => {
    if (!taskId) return;

    try {
      setLoading(true);

      const data = await commentService.getComments(taskId);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshComments();
  }, [taskId]);

  return {
    comments,
    loading,
    refreshComments,
  };
}