import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUser } from "@/lib/auth";

interface AdminRouteProps {
  redirectPath?: string;
}

/**
 * Route guard that requires authentication and role ADMIN
 */
export function AdminRoute({ redirectPath = "/home" }: AdminRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  const isAdmin = user?.role === "ADMIN";
  if (!isAdmin) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}