import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CommentForm from "../components/comments/CommentForm";
import CommentList from "../components/comments/CommentList";
import EditTaskForm from "../components/EditTaskForm";
import TaskAttachments from "../components/TaskAttachments";
import { useAuthContext } from "../context/AuthContext";
import useComments from "../hooks/useComments";
import useAttachments from "../hooks/useAttachments";
import * as attachmentService from "../services/attachment";
import * as commentService from "../services/comment";
import * as taskService from "../services/task";
import * as dependencyService from "../services/taskDependency";
import { getMembers } from "../services/projectMember";
import type { ProjectMember } from "../services/projectMember";
import type { TaskDependency } from "../services/taskDependency";

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
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);
  const [selectedDependencyId, setSelectedDependencyId] = useState("");
  const [dependencySaving, setDependencySaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { comments, loading: commentsLoading, refreshComments } = useComments(id ?? "");
  const { attachments, loading: attachmentsLoading, refreshAttachments } = useAttachments(id ?? "");

  const loadTask = async () => {
    if (!id) return;
    try { setLoading(true); setTask(await taskService.getTaskById(id)); }
    catch (err) { console.error(err); setError("Task could not be loaded."); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadTask(); }, [id]);

  useEffect(() => {
    if (!task?.projectId) return;
    const loadMembers = async () => {
      try {
        setMembers(await getMembers(task.projectId));
        setSelectedAssigneeId(task.assigneeId ?? "");
      } catch (error) {
        console.error(error);
      }
    };
    loadMembers();
  }, [task?.projectId, task?.assigneeId]);

  const loadDependencies = async () => {
    if (!id || !task?.projectId) return;
    try {
      const [tasks, allDependencies] = await Promise.all([
        taskService.getTasks(task.projectId),
        dependencyService.getDependencies(),
      ]);
      setProjectTasks(tasks);
      setDependencies(allDependencies.filter((dependency) => dependency.taskId === id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { loadDependencies(); }, [id, task?.projectId]);

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
  const updateAssignee = async () => {
    if (!id) return;
    try {
      setAssigning(true);
      if (selectedAssigneeId) {
        await taskService.assignTask(id, selectedAssigneeId);
      } else {
        await taskService.unassignTask(id);
      }
      await loadTask();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update assignee.");
    } finally {
      setAssigning(false);
    }
  };
  const addDependency = async () => {
    if (!id || !selectedDependencyId) return;
    try {
      setDependencySaving(true);
      await dependencyService.addDependency(id, selectedDependencyId);
      setSelectedDependencyId("");
      await loadDependencies();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add dependency.");
    } finally {
      setDependencySaving(false);
    }
  };
  const removeDependency = async (dependencyId: string) => {
    if (!window.confirm("Remove this dependency?")) return;
    try {
      await dependencyService.removeDependency(dependencyId);
      await loadDependencies();
    } catch (error) {
      console.error(error);
      alert("Failed to remove dependency.");
    }
  };
  const uploadAttachment = async (file?: File) => {
    if (!id || !file) return;
    try {
      setUploading(true);
      await attachmentService.uploadAttachment(id, file);
      await refreshAttachments();
    } finally { setUploading(false); }
  };
  const removeAttachment = async (attachmentId: string) => {
    await attachmentService.deleteAttachment(attachmentId);
    await refreshAttachments();
  };
  const attachmentUrl = (fileUrl: string) => `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}${fileUrl}`;
  const fileSize = (bytes: number) => bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

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
          <div className="mt-6 border-t pt-5">
            <label className="block text-sm font-medium text-gray-700">Assign task</label>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <select value={selectedAssigneeId} onChange={(event) => setSelectedAssigneeId(event.target.value)} className="min-w-56 rounded border p-2">
                <option value="">Unassigned</option>
                {members.map((member) => <option key={member.id} value={member.userId}>{member.user.name} ({member.user.email})</option>)}
              </select>
              <button onClick={updateAssignee} disabled={assigning || (selectedAssigneeId === (task.assigneeId ?? ""))} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
                {assigning ? "Saving..." : "Save assignee"}
              </button>
            </div>
            {members.length === 0 && <p className="mt-2 text-sm text-gray-500">Add project members before assigning this task.</p>}
          </div>
          <div className="mt-6 border-t pt-5">
            <label className="block text-sm font-medium text-gray-700">Task dependencies</label>
            <p className="mt-1 text-sm text-gray-500">Select a task that must be completed before this one.</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <select value={selectedDependencyId} onChange={(event) => setSelectedDependencyId(event.target.value)} className="min-w-56 rounded border p-2">
                <option value="">Select a task</option>
                {projectTasks.filter((projectTask) => projectTask.id !== id && !dependencies.some((dependency) => dependency.dependsOnTaskId === projectTask.id)).map((projectTask) => (
                  <option key={projectTask.id} value={projectTask.id}>{projectTask.title}</option>
                ))}
              </select>
              <button onClick={addDependency} disabled={!selectedDependencyId || dependencySaving} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
                {dependencySaving ? "Adding..." : "Add dependency"}
              </button>
            </div>
            {dependencies.length === 0 ? <p className="mt-3 text-sm text-gray-500">This task has no dependencies.</p> : (
              <ul className="mt-3 divide-y rounded border">
                {dependencies.map((dependency) => (
                  <li key={dependency.id} className="flex items-center justify-between gap-3 p-3">
                    <span>{dependency.dependsOn.title}</span>
                    <button onClick={() => removeDependency(dependency.id)} className="text-sm text-red-600 hover:underline">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
      <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Comments</h2>
        {commentsLoading ? <p className="mt-4">Loading comments...</p> : <CommentList comments={comments} currentUserId={user?.id} onUpdate={updateComment} onDelete={deleteComment} />}
        <div className={posting ? "pointer-events-none opacity-60" : ""}><CommentForm value={newComment} onChange={setNewComment} onSubmit={addComment} /></div>
      </section>
      <TaskAttachments attachments={attachments} loading={attachmentsLoading} uploading={uploading} currentUserId={user?.id} onUpload={uploadAttachment} onDelete={removeAttachment} />
      {false && (
      <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Attachments</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} className="max-w-full" />
          <button onClick={() => uploadAttachment(selectedFile ?? undefined)} disabled={!selectedFile || uploading} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
            {uploading ? "Uploading..." : "Upload file"}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-500">Maximum file size: 10 MB.</p>
        {attachmentsLoading ? <p className="mt-4">Loading attachments...</p> : attachments.length === 0 ? (
          <p className="mt-4 text-gray-500">No attachments yet.</p>
        ) : (
          <ul className="mt-4 divide-y rounded border">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                <div>
                  <a href={attachmentUrl(attachment.fileUrl)} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">{attachment.fileName}</a>
                  <p className="text-sm text-gray-500">{fileSize(attachment.fileSize)} · uploaded by {attachment.uploader?.name || "Unknown user"}</p>
                </div>
                {attachment.uploaderId === user?.id && <button onClick={() => removeAttachment(attachment.id)} className="text-sm text-red-600 hover:underline">Delete</button>}
              </li>
            ))}
          </ul>
        )}
      </section>
      )}
    </div>
  );
}
