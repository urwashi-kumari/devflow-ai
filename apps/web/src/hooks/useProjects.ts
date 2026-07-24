import { useEffect, useState } from "react";
import { getProjects } from "../services/project";

export default function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      console.log("Projects:", data);

      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
  };
}