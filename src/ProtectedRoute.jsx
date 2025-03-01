import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ component: Component }) => {
  const { user } = useAuth();

  //Si l'utilisateur n'est pas connecté, on le redirige vers "/login"
  if (!user) {
    return <Navigate to="/laboratory" replace />;
  }

  // Si l'utilisateur est connecté mais n'est pas admin, on le redirige vers "/"
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur est admin, on affiche la page protégée
  return <Component />;
};

export default ProtectedRoute;
