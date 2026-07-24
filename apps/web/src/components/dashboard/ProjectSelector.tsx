interface Project {
  id: string;
  name: string;
}

interface ProjectSelectorProps {
  projects: Project[];
  selectedProject: string;
  onChange: (id: string) => void;
}

export default function ProjectSelector({
  projects,
  selectedProject,
  onChange,
}: ProjectSelectorProps) {
  return (
    <select
      value={selectedProject}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px",
        minWidth: "250px",
        marginBottom: "20px",
      }}
    >
      {projects.map((project) => (
        <option
          key={project.id}
          value={project.id}
        >
          {project.name}
        </option>
      ))}
    </select>
  );
}