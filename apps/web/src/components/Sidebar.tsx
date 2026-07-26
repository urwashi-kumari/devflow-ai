import { NavLink } from "react-router-dom";
import { Bell, CheckSquare, FolderKanban, LayoutDashboard, Settings, Sparkles, X } from "lucide-react";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Tasks", path: "/tasks", icon: CheckSquare },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-68 shrink-0 flex-col bg-slate-950 p-5 text-white shadow-2xl transition-transform duration-200 lg:static lg:flex lg:translate-x-0 lg:shadow-none ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-900/40"><Sparkles size={21} /></span>
        <div><p className="text-lg font-bold tracking-tight">DevFlow</p><p className="text-xs text-slate-400">Work smarter, together</p></div>
        <button onClick={onClose} className="ml-auto rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" aria-label="Close navigation"><X size={20} /></button>
      </div>
      <nav className="mt-10 space-y-1.5">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/30" : "text-slate-400 hover:bg-white/8 hover:text-white"}`}>
            <Icon size={19} />{name}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl bg-gradient-to-br from-violet-600/30 to-fuchsia-500/20 p-4"><p className="text-sm font-semibold">Make progress daily</p><p className="mt-1 text-xs leading-5 text-slate-300">Plan work, keep your team aligned, and celebrate what ships.</p></div>
    </aside>
  );
}
