import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // ⏳ Esperar a que AuthContext cargue localStorage
  if (loading) {
    return null; // o un spinner si quieres
  }

  // 🔐 Si no hay usuario tras cargar → login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
