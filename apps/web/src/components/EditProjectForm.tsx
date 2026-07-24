import { useState } from "react";
import { updateProject } from "../services/project";

interface Props {
  project: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditProjectForm({
  project,
  onSuccess,
  onCancel,
}: Props) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateProject(project.id || project._id, {
        name,
        description,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow border p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-5">
        Edit Project
      </h2>

      <input
        className="w-full border rounded-lg p-3 mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full border rounded-lg p-3 mb-4"
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border px-5 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}