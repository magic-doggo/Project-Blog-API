import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { token } = useAuth();
  const location = useLocation();

  if (!token) {
    console.log("no token, redirect to login");
    return <Navigate to="/admin/login" state={{ from: location }} replace />; //after login, redirect to page the user was trying to access when being redirected to login
  }
  return <Outlet />;
}

