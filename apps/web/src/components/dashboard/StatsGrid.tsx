import { CheckCircle2, CircleDot, Clock3, Flame, ListTodo, OctagonAlert, Users } from "lucide-react";
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

export default function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    ["Total tasks", stats.totalTasks, ListTodo, "violet"],
    ["To do", stats.todo, CircleDot, "sky"],
    ["In progress", stats.inProgress, Clock3, "amber"],
    ["Completed", stats.done, CheckCircle2, "emerald"],
    ["High priority", stats.highPriority, Flame, "rose"],
    ["Overdue", stats.overdue, OctagonAlert, "orange"],
    ["Members", stats.members, Users, "indigo"],
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(([title, value, icon, tone]) => <StatCard key={title} title={title} value={value} icon={icon} tone={tone} />)}
    </div>
  );
}
