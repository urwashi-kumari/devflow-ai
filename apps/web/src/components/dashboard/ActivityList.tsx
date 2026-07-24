interface Activity {
  id: string;
  action: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({
  activities,
}: ActivityListProps) {
  return (
    <div
      style={{
        marginTop: "30px",
      }}
    >
      <h2>Recent Activity</h2>

      {activities.length === 0 ? (
        <p>No activity found.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li
              key={activity.id}
              style={{
                marginBottom: "12px",
              }}
            >
              <strong>{activity.user?.name}</strong>{" "}
              {activity.action}
              <br />
              <small>
                {new Date(activity.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}