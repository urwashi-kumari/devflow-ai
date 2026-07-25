import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  tone: "violet" | "sky" | "amber" | "emerald" | "rose" | "orange" | "indigo";
}

const tones = {
  violet: "from-violet-500 to-purple-600 shadow-violet-200",
  sky: "from-sky-500 to-cyan-500 shadow-sky-200",
  amber: "from-amber-400 to-orange-500 shadow-amber-200",
  emerald: "from-emerald-500 to-teal-500 shadow-emerald-200",
  rose: "from-rose-500 to-pink-600 shadow-rose-200",
  orange: "from-orange-500 to-red-500 shadow-orange-200",
  indigo: "from-indigo-500 to-blue-600 shadow-indigo-200",
};

export default function StatCard({ title, value, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-white/70 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`rounded-xl bg-gradient-to-br p-3 text-white shadow-lg ${tones[tone]}`}>
          <Icon size={20} strokeWidth={2.5} />
        </span>
      </div>
    </article>
  );
}
