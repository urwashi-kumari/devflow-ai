import { FolderKanban } from "lucide-react";

interface Project { id: string; name: string; }
interface ProjectSelectorProps { projects: Project[]; selectedProject: string; onChange: (id: string) => void; }

export default function ProjectSelector({ projects, selectedProject, onChange }: ProjectSelectorProps) {
  return (
    <label className="flex items-center gap-3 rounded-xl bg-white/15 px-3 py-2 text-sm font-medium text-white backdrop-blur">
      <FolderKanban size={18} />
      <select value={selectedProject} onChange={(event) => onChange(event.target.value)} className="min-w-0 bg-transparent font-semibold outline-none">
        {projects.map((project) => <option key={project.id} value={project.id} className="text-slate-900">{project.name}</option>)}
      </select>
    </label>
  );
}
