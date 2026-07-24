import { useState } from "react";
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Projects
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
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

      {loading && (
        <p>Loading projects...</p>
      )}

      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-20 border rounded-xl bg-white shadow">
          <h2 className="text-xl font-semibold">
            No Projects Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Click "New Project" to create your first project.
          </p>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <div
              key={project.id || project._id}
              className="bg-white rounded-xl shadow-md border p-5 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-bold">
                {project.name}
              </h2>

              <p className="mt-2 text-gray-600 min-h-15">
                {project.description || "No description"}
              </p>

              <div className="mt-4 text-sm text-gray-500">
                Branch: {project.githubBranch || "main"}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setEditingProject(project)}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(project.id || project._id)
                  }
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
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