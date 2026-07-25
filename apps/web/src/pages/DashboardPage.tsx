import { useEffect, useState } from "react";
import { CheckCircle2, ListChecks, Sparkles } from "lucide-react";
import { getProjects } from "../services/project";
import { useAuthContext } from "../context/AuthContext";
import useDashboard from "../hooks/useDashboard";
import ProjectSelector from "../components/dashboard/ProjectSelector";
import StatsGrid from "../components/dashboard/StatsGrid";
import ActivityList from "../components/dashboard/ActivityList";

interface Project { id: string; name: string; }

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuthContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    getProjects().then((data) => { setProjects(data); if (data.length) setSelectedProject(data[0].id); }).catch(console.error);
  }, []);

  const { projectStats, userStats, activities, loading } = useDashboard(selectedProject, user?.id ?? "");
  const completion = projectStats?.totalTasks ? Math.round((projectStats.done / projectStats.totalTasks) * 100) : 0;

  if (authLoading || (projects.length > 0 && loading)) return <div className="p-8 text-slate-500">Loading your dashboard...</div>;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-fuchsia-600 to-rose-500 px-6 py-8 text-white shadow-xl shadow-fuchsia-200 sm:px-8">
        <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-white/15" /><div className="absolute -bottom-24 right-32 h-52 w-52 rounded-full bg-amber-300/20" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80"><Sparkles size={18} /> YOUR WORKSPACE</div><h1 className="text-3xl font-bold sm:text-4xl">Hi, {user?.name?.split(" ")[0] ?? "there"}! <span className="inline-block">👋</span></h1><p className="mt-2 max-w-lg text-white/85">Keep your momentum going—here’s a colorful snapshot of what’s happening.</p></div>
          {projects.length > 0 && <ProjectSelector projects={projects} selectedProject={selectedProject} onChange={setSelectedProject} />}
        </div>
      </section>

      {projects.length === 0 ? <section className="rounded-2xl bg-white p-10 text-center shadow-sm"><h2 className="text-xl font-bold text-slate-900">Your workspace is ready</h2><p className="mt-2 text-slate-500">Create a project to see its progress here.</p></section> : <>
        {projectStats && <section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold text-slate-900">Project overview</h2><p className="text-sm text-slate-500">A quick view of your work at a glance.</p></div><span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-bold text-violet-700">{completion}% complete</span></div><StatsGrid stats={projectStats} /></section>}
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr]">
          <section className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-6 text-white shadow-lg shadow-cyan-100"><div className="flex items-center gap-2 text-cyan-100"><ListChecks size={20} /><span className="font-semibold">My task pulse</span></div><p className="mt-5 text-5xl font-bold">{userStats?.assignedTasks ?? 0}</p><p className="mt-1 text-cyan-100">tasks assigned to you</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/15 p-3"><CheckCircle2 size={18} /><p className="mt-3 text-2xl font-bold">{userStats?.completedTasks ?? 0}</p><p className="text-xs text-cyan-100">Completed</p></div><div className="rounded-xl bg-white/15 p-3"><ListChecks size={18} /><p className="mt-3 text-2xl font-bold">{userStats?.pendingTasks ?? 0}</p><p className="text-xs text-cyan-100">Pending</p></div></div></section>
          <ActivityList activities={activities} />
        </div>
      </>}
    </div>
  );
}
