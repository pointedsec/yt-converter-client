import { Navigate } from "react-router-dom";
import { UseUserStore } from "@/store/userStore";
import { ReactNode } from "react";
import { User } from "@/types/AuthTypes";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedRouteProps) {
  const user = UseUserStore((state) => state.user) as User;

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (user.active === false) {
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>; // Asegura que se rendericen correctamente los hijos
}
