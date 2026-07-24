import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Bell,
  Settings,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: FolderKanban,
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "260px",
        background: "#0f172a",
        color: "#fff",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <h2
        style={{
          marginBottom: "32px",
        }}
      >
        DevFlow AI
      </h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "8px",
                textDecoration: "none",
                color: isActive ? "#38bdf8" : "#fff",
                background: isActive ? "#1e293b" : "transparent",
              })}
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}