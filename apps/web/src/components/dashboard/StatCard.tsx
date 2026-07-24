interface StatCardProps {
  title: string;
  value: number;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#666",
          fontWeight: 500,
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          marginTop: "12px",
          marginBottom: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}