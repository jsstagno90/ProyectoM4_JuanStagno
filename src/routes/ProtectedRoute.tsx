import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


interface Props {
  children: React.ReactNode;
}


export function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
  return <p>Cargando...</p>;
}

if (!user) {
  return <Navigate to="/login" replace />;
}

return children;
}   