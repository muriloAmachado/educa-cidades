"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sessao from "@/lib/utils/Sessao";
import { routes } from "../_navigation/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ["Administrador", "Básico"],
  redirectTo = routes.agenda 
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const role = Sessao.buscarRole();
    
    if (role && !allowedRoles.includes(role)) {
      router.push(redirectTo);
    }
  }, [allowedRoles, redirectTo, router]);

  const role = Sessao.buscarRole();
  
  if (role && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}

