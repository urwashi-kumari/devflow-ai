import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const { token, loading } = useAuthContext();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}