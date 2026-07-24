import { useNavigate, useParams } from "react-router-dom";
import useTasks from "../hooks/useTasks";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tasks, loading } = useTasks(id ?? "");

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

        <button className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">
          + New Task
        </button>
      </div>

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
                    <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                      Edit
                    </button>

                    <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600">
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