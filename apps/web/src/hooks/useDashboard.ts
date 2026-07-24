import { useEffect, useState } from "react";
import * as dashboardService from "../services/dashboard";

export default function useDashboard(
  projectId: string,
  userId: string
) {
  const [projectStats, setProjectStats] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshDashboard = async () => {
    try {
      setLoading(true);

      const [project, user, activity] = await Promise.all([
        dashboardService.getProjectStats(projectId),
        dashboardService.getUserStats(userId),
        dashboardService.getRecentActivities(projectId),
      ]);

      setProjectStats(project);
      setUserStats(user);
      setActivities(activity);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId && userId) {
      refreshDashboard();
    }
  }, [projectId, userId]);

  return {
    projectStats,
    userStats,
    activities,
    loading,
    refreshDashboard,
  };
}