import { useEffect, useState } from "react";

import { getProjects } from "../services/project";
import { useAuthContext } from "../context/AuthContext";
import useDashboard from "../hooks/useDashboard";

import ProjectSelector from "../components/dashboard/ProjectSelector";
import StatsGrid from "../components/dashboard/StatsGrid";
import ActivityList from "../components/dashboard/ActivityList";

interface Project {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);

        if (data.length > 0) {
          setSelectedProject(data[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadProjects();
  }, []);

  const {
    projectStats,
    userStats,
    activities,
    loading,
  } = useDashboard(
    selectedProject,
    user?.id ?? ""
  );

  if (authLoading || loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>

      <p>Welcome, {user?.name}</p>

      {projects.length > 0 && (
        <ProjectSelector
          projects={projects}
          selectedProject={selectedProject}
          onChange={setSelectedProject}
        />
      )}

      {projectStats && (
        <>
          <h2>Project Statistics</h2>

          <StatsGrid stats={projectStats} />
        </>
      )}

      {userStats && (
        <>
          <h2 style={{ marginTop: "40px" }}>
            My Statistics
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
              gap: "16px",
            }}
          >
            <div>
              <strong>Assigned</strong>
              <h2>{userStats.assignedTasks}</h2>
            </div>

            <div>
              <strong>Completed</strong>
              <h2>{userStats.completedTasks}</h2>
            </div>

            <div>
              <strong>Pending</strong>
              <h2>{userStats.pendingTasks}</h2>
            </div>
          </div>
        </>
      )}

      <ActivityList activities={activities} />
    </div>
  );
}