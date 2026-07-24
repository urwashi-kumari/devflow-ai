import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useTasks from "../hooks/useTasks";
import CreateTaskForm from "../components/CreateTaskForm";
import EditTaskForm from "../components/EditTaskForm";
import * as taskService from "../services/task";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const { tasks, loading, refreshTasks } = useTasks(id ?? "");

  const handleDelete = async (taskId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await taskService.deleteTask(taskId);
      await refreshTasks();
      alert("Task deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete task.");
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/projects")}
            className="mb-3 text-blue-600 hover:underline"
          >
            ← Back to Projects
          </button>

          <h1 className="text-3xl font-bold">Project Details</h1>

          <p className="mt-2 text-gray-500">
            Project ID: {id}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setShowCreateForm(true);
          }}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          + New Task
        </button>
      </div>

      {/* Create Task */}
      {showCreateForm && (
        <CreateTaskForm
          projectId={id ?? ""}
          onSuccess={() => {
            setShowCreateForm(false);
            refreshTasks();
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Task */}
      {editingTask && (
        <EditTaskForm
          task={editingTask}
          onSuccess={() => {
            setEditingTask(null);
            refreshTasks();
          }}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {/* Tasks */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold">Tasks</h2>

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-gray-500">
            No tasks found for this project.
          </p>
        ) : (
          <div className="space-y-4">
            {tasks.map((task: any) => (
              <div
                key={task.id}
                className="rounded-lg border p-5 shadow-sm"
              >
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
                    <button
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingTask(task);
                      }}
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}