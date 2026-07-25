import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Topbar />

        <main
          style={{
            flex: 1,
            padding: "24px",
        background: "linear-gradient(135deg, #f8fafc 0%, #f5f3ff 55%, #fdf2f8 100%)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
