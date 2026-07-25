import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/project";
import { filterTasks } from "../services/task";

interface Project { id: string; name: string; }

export default function TasksPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ projectId: "", search: "", status: "", priority: "" });

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
        const data = await filterTasks({ ...activeFilters, page: 1, limit: 50 });
        setTasks(data.tasks);
        setTotal(data.total);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [filters]);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="text-3xl font-bold">All Tasks</h1>
      <p className="mt-1 text-gray-500">Search and filter tasks across your projects.</p>

      <section className="mt-6 grid gap-3 rounded-xl border bg-white p-5 shadow-sm md:grid-cols-4">
        <select value={filters.projectId} onChange={(event) => setFilters({ ...filters, projectId: event.target.value })} className="rounded border p-2">
          <option value="">All projects</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search task title" className="rounded border p-2" />
        <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="rounded border p-2">
          <option value="">All statuses</option><option value="TODO">TODO</option><option value="IN_PROGRESS">IN PROGRESS</option><option value="DONE">DONE</option>
        </select>
        <select value={filters.priority} onChange={(event) => setFilters({ ...filters, priority: event.target.value })} className="rounded border p-2">
          <option value="">All priorities</option><option value="LOW">LOW</option><option value="MEDIUM">MEDIUM</option><option value="HIGH">HIGH</option>
        </select>
      </section>

      <p className="mt-5 text-sm text-gray-500">{total} task{total === 1 ? "" : "s"} found</p>
      {loading ? <p className="mt-4">Loading tasks...</p> : tasks.length === 0 ? (
        <div className="mt-4 rounded-xl border bg-white p-10 text-center text-gray-500">No tasks match these filters.</div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <article key={task.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><h2 className="text-xl font-semibold">{task.title}</h2><span className="rounded bg-red-100 px-2 py-1 text-sm text-red-700">{task.priority}</span></div>
              <p className="mt-3 text-gray-600">{task.description || "No description"}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600"><span>Status: {task.status}</span><span>Assignee: {task.assignee?.name || "Unassigned"}</span></div>
              <Link to={`/tasks/${task.id}`} className="mt-5 inline-block rounded bg-slate-700 px-4 py-2 text-white hover:bg-slate-800">View details</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
