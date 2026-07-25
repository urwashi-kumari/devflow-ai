import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import EditTaskForm from "../components/EditTaskForm";
import { useAuthContext } from "../context/AuthContext";
import useComments from "../hooks/useComments";
import * as commentService from "../services/comment";
import * as taskService from "../services/task";

export default function TaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const { comments, loading: commentsLoading, refreshComments } = useComments(id ?? "");

  const loadTask = async () => {
    if (!id) return;
    try { setLoading(true); setTask(await taskService.getTaskById(id)); }
    catch (err) { console.error(err); setError("Task could not be loaded."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadTask(); }, [id]);

  const addComment = async () => {
    if (!id || !user || !newComment.trim()) return;
    try {
      setPosting(true);
      await commentService.createComment(id, { content: newComment.trim(), authorId: user.id });
      setNewComment("");
      await refreshComments();
    } catch (err) { console.error(err); alert("Failed to add comment."); }
    finally { setPosting(false); }
  };
  const updateComment = async (commentId: string, content: string) => { await commentService.updateComment(commentId, content); await refreshComments(); };
  const deleteComment = async (commentId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    try { await commentService.deleteComment(commentId); await refreshComments(); }
    catch (err) { console.error(err); alert("Failed to delete comment."); }
  };
  const deleteTask = async () => {
    if (!id || !window.confirm("Delete this task?")) return;
    try { await taskService.deleteTask(id); navigate(`/projects/${task.projectId}`); }
    catch (err) { console.error(err); alert("Failed to delete task."); }
  };

  if (loading) return <div className="p-8">Loading task...</div>;
  if (error || !task) return <div className="p-8 text-red-600">{error || "Task not found."}</div>;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <Link to={`/projects/${task.projectId}`} className="text-blue-600 hover:underline">← Back to project</Link>
      {isEditing ? (
        <EditTaskForm task={task} onSuccess={async () => { setIsEditing(false); await loadTask(); }} onCancel={() => setIsEditing(false)} />
      ) : (
        <section className="mt-5 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-sm text-gray-500">Task details</p><h1 className="text-3xl font-bold">{task.title}</h1></div>
            <div className="flex gap-3"><button onClick={() => setIsEditing(true)} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Edit</button><button onClick={deleteTask} className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">Delete</button></div>
          </div>
          <p className="mt-5 whitespace-pre-wrap text-gray-700">{task.description || "No description provided."}</p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div><dt className="text-sm text-gray-500">Status</dt><dd className="font-medium">{task.status}</dd></div>
            <div><dt className="text-sm text-gray-500">Priority</dt><dd className="font-medium">{task.priority}</dd></div>
            <div><dt className="text-sm text-gray-500">Due date</dt><dd className="font-medium">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</dd></div>
            <div><dt className="text-sm text-gray-500">Assignee</dt><dd className="font-medium">{task.assignee?.name || "Unassigned"}</dd></div>
          </dl>
        </section>
      )}
      <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Comments</h2>
        {commentsLoading ? <p className="mt-4">Loading comments...</p> : <CommentList comments={comments} currentUserId={user?.id} onUpdate={updateComment} onDelete={deleteComment} />}
        <div className={posting ? "pointer-events-none opacity-60" : ""}><CommentForm value={newComment} onChange={setNewComment} onSubmit={addComment} /></div>
      </section>
    </div>
  );
}
