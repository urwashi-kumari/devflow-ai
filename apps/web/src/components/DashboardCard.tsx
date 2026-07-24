type DashboardCardProps = {
  title: string;
  value: string | number;
};

export default function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h4
        style={{
          marginBottom: "10px",
          color: "#64748b",
        }}
      >
        {title}
      </h4>

      <h1
        style={{
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}