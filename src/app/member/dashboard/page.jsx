"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import MemberDashboard from "@/components/MemberDashboard";

export default function MemberDashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "member") {
      router.push("/");
    }
  }, [user]);

  if (!user) return null;

  return <MemberDashboard user={user} onLogout={logout} />;
}
