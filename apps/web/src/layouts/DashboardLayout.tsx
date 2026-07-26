import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {mobileNavigationOpen && <button onClick={() => setMobileNavigationOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" aria-label="Close navigation overlay" />}
      <Sidebar mobileOpen={mobileNavigationOpen} onClose={() => setMobileNavigationOpen(false)} />
      <div className="flex flex-1 flex-col">
        <Topbar onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-violet-50 to-pink-50 p-6"><Outlet /></main>
      </div>
    </div>
  );
}
