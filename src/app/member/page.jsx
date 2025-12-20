"use client";

import MemberAuthScreen from "@/components/MemberAuthScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MemberLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <MemberAuthScreen
      onLogin={login}
      onBack={() => router.push("/")}
    />
  );
}
