"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = (userData) => {
    setUser(userData);

    if (userData.role === "super") router.push("/admin/dashboard");
    else if (userData.role === "group") router.push("/partner/dashboard");
    else if (userData.role === "member") router.push("/member/dashboard");
    else router.push("/");
  };

  const logout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
