import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function Topbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>Welcome, {user?.name}</h3>
        <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
          Have a productive day 
        </p>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </header>
  );
}