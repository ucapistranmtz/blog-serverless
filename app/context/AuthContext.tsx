"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { User, UserSchema, AuthContextType } from "../types/auth.schema";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("capistran_lab_token");
    const savedUser = localStorage.getItem("capistran_lab_user");

    if (savedToken && savedUser) {
      try {
        const validatedUser = UserSchema.parse(JSON.parse(savedUser));
        setToken(savedToken);
        setUser(validatedUser);
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((newToken: string, userData: User) => {
    // We still use Zod 4 for runtime safety! [cite: 2026-02-23]
    const validatedUser = UserSchema.parse(userData);

    setToken(newToken);
    setUser(validatedUser);
    localStorage.setItem("capistran_lab_token", newToken);
    localStorage.setItem("capistran_lab_user", JSON.stringify(validatedUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  }, []);

  // Now 'value' matches AuthContextType exactly
  const value: AuthContextType = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [token, user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
