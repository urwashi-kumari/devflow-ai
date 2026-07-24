import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useProjects from "../hooks/useProjects";
import CreateProjectForm from "../components/CreateProjectForm";
import EditProjectForm from "../components/EditProjectForm";
import { deleteProject } from "../services/project";

export default function ProjectsPage() {
  const {
    projects,
    loading,
    error,
    fetchProjects,
  } = useProjects();

  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project.");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
        >
          {showForm ? "Close" : "+ New Project"}
        </button>
      </div>

      {showForm && (
        <CreateProjectForm
          onSuccess={() => {
            fetchProjects();
            setShowForm(false);
          }}
        />
      )}

      {editingProject && (
        <EditProjectForm
          project={editingProject}
          onSuccess={() => {
            fetchProjects();
            setEditingProject(null);
          }}
          onCancel={() => setEditingProject(null)}
        />
      )}

      {loading && <p>Loading projects...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-xl border bg-white py-20 text-center shadow">
          <h2 className="text-xl font-semibold">
            No Projects Yet
          </h2>

          <p className="mt-2 text-gray-500">
            Click "New Project" to create your first project.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: any) => (
            <div
              key={project.id || project._id}
              className="rounded-xl border bg-white p-5 shadow-md transition hover:shadow-xl"
            >
              <h2 className="text-xl font-bold">
                {project.name}
              </h2>

              <p className="mt-2 min-h-15 text-gray-600">
                {project.description || "No description"}
              </p>

              <div className="mt-4 text-sm text-gray-500">
                Branch: {project.githubBranch || "main"}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    navigate(`/projects/${project.id || project._id}`)
                  }
                  className="rounded-lg bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                >
                  View Details
                </button>

                <button
                  onClick={() => setEditingProject(project)}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(project.id || project._id)
                  }
                  className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}