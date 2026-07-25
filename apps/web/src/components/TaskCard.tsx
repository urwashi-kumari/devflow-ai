import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

import useComments from "../hooks/useComments";
import * as commentService from "../services/comment";

import CommentForm from "./comments/CommentForm";
import CommentList from "./comments/CommentList";

interface TaskCardProps {
  task: any;
  onEdit: (task: any) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuthContext();

  const {
    comments,
    loading,
    refreshComments,
  } = useComments(task.id);

  const handleComment = async () => {
  if (!newComment.trim()) return;

  if (!user) {
    alert("User not found");
    return;
  }

  try {
    await commentService.createComment(task.id, {
      content: newComment,
      authorId: user.id,
    });

    setNewComment("");
    await refreshComments();
  } catch (err: any) {
    console.error(err);
    console.log(err.response?.data);

    alert(
      err.response?.data?.message ||
      "Failed to add comment."
    );
  }
};

  return (
    <div className="rounded-lg border p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {task.title}
        </h3>

        <span className="rounded bg-red-100 px-3 py-1 text-sm text-red-700">
          {task.priority}
        </span>
      </div>

      <p className="mt-3 text-gray-600">
        {task.description || "No description"}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded bg-blue-100 px-3 py-1 text-sm text-blue-700">
          {task.status}
        </span>

        <div className="flex gap-3">
          <Link to={`/tasks/${task.id}`} className="rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-800">Details</Link>
          <button
            onClick={() => onEdit(task)}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Delete
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          >
            💬 Comments
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-6 border-t pt-4">
          <h4 className="mb-3 font-semibold">
            Comments
          </h4>

          {loading ? (
            <p>Loading comments...</p>
          ) : (
            <CommentList comments={comments} />
          )}

          <CommentForm
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleComment}
          />
        </div>
      )}
    </div>
  );
}
