"use client";

import LoginScreen from "@/components/LoginScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <LoginScreen
      onLogin={login}
      onBack={() => router.push("/")}
    />
  );
}
