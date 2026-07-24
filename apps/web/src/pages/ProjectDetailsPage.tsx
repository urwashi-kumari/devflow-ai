

import { useParams } from "react-router-dom";

export default function ProjectDetailsPage() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Project Details</h1>

      <p className="mt-2 text-gray-600">
        Project ID: {id}
      </p>

      <div className="mt-8 rounded-lg border bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Tasks</h2>

        <p className="mt-2 text-gray-500">
          No tasks available yet.
        </p>

        <button className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          + New Task
        </button>
      </div>
    </div>
  );
}