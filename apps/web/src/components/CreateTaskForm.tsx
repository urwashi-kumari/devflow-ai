import { useState } from "react";
import * as taskService from "../services/task";

interface Props {
  projectId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreateTaskForm({
  projectId,
  onSuccess,
  onCancel,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await taskService.createTask({
        ...form,
        projectId,
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 rounded-xl border bg-white p-6 shadow">
      <h2 className="mb-6 text-2xl font-bold">
        Create Task
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="title"
          placeholder="Task title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full rounded border p-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded border p-3"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded border p-3"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">
              IN_PROGRESS
            </option>
            <option value="DONE">DONE</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="rounded border p-3"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">
              MEDIUM
            </option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full rounded border p-3"
        />

        <div className="flex gap-3">
          <button
            disabled={loading}
            className="rounded bg-blue-600 px-5 py-2 text-white"
          >
            {loading
              ? "Creating..."
              : "Create Task"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded bg-gray-500 px-5 py-2 text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}