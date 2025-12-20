"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import GroupAdminDashboard from "@/components/GroupAdminDashboard";

export default function PartnerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !["group", "super"].includes(user.role)) {
      router.push("/");
    }
  }, [user]);

  if (!user) return null;

  return <GroupAdminDashboard user={user} onLogout={logout} />;
}
