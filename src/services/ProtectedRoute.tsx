import { Navigate } from "react-router-dom";
import { UseUserStore } from "@/store/userStore";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = UseUserStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // Asegura que se rendericen correctamente los hijos
}
