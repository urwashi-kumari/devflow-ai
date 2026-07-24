import { useState } from "react";
import { createProject } from "../services/project";

interface Props {
  onSuccess: () => void;
}

export default function CreateProjectForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createProject({
        name,
        description,
      });

      setName("");
      setDescription("");

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-xl border bg-white p-6 shadow"
    >
      <h2 className="text-xl font-bold mb-4">Create Project</h2>

      <input
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full border rounded-lg p-3 mb-4"
        placeholder="Description"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error && (
        <p className="text-red-500 mb-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
}