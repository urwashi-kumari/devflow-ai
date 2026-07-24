import DashboardCard from "../components/DashboardCard";

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard</h1>

      <p>Welcome to DevFlow AI.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <DashboardCard
          title="Projects"
          value={12}
        />

        <DashboardCard
          title="Tasks"
          value={38}
        />

        <DashboardCard
          title="Completed"
          value={24}
        />

        <DashboardCard
          title="Team Members"
          value={8}
        />
      </div>
    </>
  );
}