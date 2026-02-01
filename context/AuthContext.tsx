"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = {
  name: string;
  email: string;
};

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  login: (payload: { email: string; password: string }) => void;
  register: (payload: { name: string; email: string; password: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const STORAGE_KEY = "gn-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { isLoggedIn: boolean; user?: User };
      if (parsed?.isLoggedIn && parsed.user) {
        setIsLoggedIn(true);
        setUser(parsed.user);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persist = (nextUser: User) => {
    setIsLoggedIn(true);
    setUser(nextUser);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ isLoggedIn: true, user: nextUser })
    );
  };

  const login = ({ email }: { email: string; password: string }) => {
    const name = email.split("@")[0] || "Usuario";
    persist({ name, email });
  };

  const register = ({
    name,
    email,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    persist({ name, email });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      login,
      register,
      logout,
    }),
    [isLoggedIn, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

