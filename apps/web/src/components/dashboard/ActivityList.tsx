import { Activity } from "lucide-react";

interface DashboardActivity {
  id: string;
  action: string;
  createdAt: string;
  user?: { name: string };
}

interface ActivityListProps { activities: DashboardActivity[]; }

export default function ActivityList({ activities }: ActivityListProps) {
  return (
    <section className="rounded-2xl border border-white/70 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-xl bg-fuchsia-100 p-2 text-fuchsia-600"><Activity size={20} /></span>
        <div><h2 className="font-bold text-slate-900">Recent activity</h2><p className="text-sm text-slate-500">The latest updates across this project.</p></div>
      </div>
      {activities.length === 0 ? (
        <p className="mt-6 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">No activity yet. Create or update a task to get started.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-sm font-bold text-white">{activity.user?.name?.slice(0, 1).toUpperCase() ?? "D"}</div>
              <div className="min-w-0"><p className="text-sm text-slate-700"><span className="font-semibold text-slate-900">{activity.user?.name ?? "A teammate"}</span> {activity.action}</p><p className="mt-1 text-xs text-slate-400">{new Date(activity.createdAt).toLocaleString()}</p></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
