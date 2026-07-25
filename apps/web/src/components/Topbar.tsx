import { Bell, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate(); const { user, logout } = useAuthContext();
  const initials = user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() ?? "U";
  return <header className="flex h-18 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 backdrop-blur lg:px-8"><button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button><div className="hidden sm:block"><p className="text-sm font-semibold text-slate-900">Welcome back, {user?.name?.split(" ")[0] ?? "there"}</p><p className="text-xs text-slate-500">Let’s make today count.</p></div><div className="ml-auto flex items-center gap-3"><button onClick={() => navigate("/notifications")} className="relative rounded-xl p-2.5 text-slate-500 hover:bg-violet-50 hover:text-violet-600" aria-label="Notifications"><Bell size={20} /></button><button onClick={() => navigate("/settings")} className="flex items-center gap-2 rounded-xl p-1.5 pr-3 hover:bg-slate-100"><span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">{initials}</span><span className="hidden text-sm font-semibold text-slate-700 sm:block">{user?.name}</span></button><button onClick={() => { logout(); navigate("/login"); }} className="rounded-xl p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Sign out"><LogOut size={19} /></button></div></header>;
}
