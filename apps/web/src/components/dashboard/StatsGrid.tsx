import StatCard from "./StatCard";

interface StatsGridProps {
  stats: {
    totalTasks: number;
    todo: number;
    inProgress: number;
    done: number;
    highPriority: number;
    overdue: number;
    members: number;
  };
}

export default function StatsGrid({
  stats,
}: StatsGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
        gap: "16px",
      }}
    >
      <StatCard title="Total Tasks" value={stats.totalTasks} />
      <StatCard title="Todo" value={stats.todo} />
      <StatCard title="In Progress" value={stats.inProgress} />
      <StatCard title="Done" value={stats.done} />
      <StatCard title="High Priority" value={stats.highPriority} />
      <StatCard title="Overdue" value={stats.overdue} />
      <StatCard title="Members" value={stats.members} />
    </div>
  );
}