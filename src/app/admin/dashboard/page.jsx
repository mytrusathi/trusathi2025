"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "super") {
      router.push("/");
    }
  }, [user]);

  if (!user) return null;

  return <SuperAdminDashboard user={user} onLogout={logout} />;
}
