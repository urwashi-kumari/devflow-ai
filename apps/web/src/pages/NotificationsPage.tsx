import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import * as notificationService from "../services/notification";
import type { Notification } from "../services/notification";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshNotifications = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setNotifications(await notificationService.getNotifications(user.id));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshNotifications(); }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      await refreshNotifications();
    } catch (error) {
      console.error(error);
      alert("Failed to mark notification as read.");
    }
  };

  const removeNotification = async (notificationId: string) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await notificationService.deleteNotification(notificationId);
      await refreshNotifications();
    } catch (error) {
      console.error(error);
      alert("Failed to delete notification.");
    }
  };

  if (authLoading || loading) return <div className="p-8">Loading notifications...</div>;

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-gray-500">Updates assigned to your account.</p>
        </div>
        <button onClick={refreshNotifications} className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">Refresh</button>
      </div>

      {notifications.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-10 text-center text-gray-500">No notifications yet.</div>
      ) : (
        <div className="mt-6 space-y-3">
          {notifications.map((notification) => (
            <article key={notification.id} className={`rounded-xl border p-5 shadow-sm ${notification.isRead ? "bg-white" : "border-blue-300 bg-blue-50"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2"><h2 className="font-semibold">{notification.title}</h2>{!notification.isRead && <span className="rounded bg-blue-600 px-2 py-0.5 text-xs text-white">New</span>}</div>
                  <p className="mt-2 text-gray-700">{notification.message}</p>
                  <p className="mt-2 text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-3 text-sm">
                  {!notification.isRead && <button onClick={() => markAsRead(notification.id)} className="text-blue-600 hover:underline">Mark as read</button>}
                  <button onClick={() => removeNotification(notification.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
