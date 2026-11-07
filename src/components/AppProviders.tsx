"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { ApiError, apiRequest, type User } from "@/lib/api";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  theme: "light" | "dark";
  toggleTheme: () => void;
  notify: (message: string, kind?: "success" | "error") => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const themeListeners = new Set<() => void>();

function getThemeSnapshot(): "light" | "dark" {
  return localStorage.getItem("gn-theme") === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): "light" | "dark" {
  return "light";
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function saveTheme(theme: "light" | "dark") {
  localStorage.setItem("gn-theme", theme);
  themeListeners.forEach((listener) => listener());
}

export function useApp() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useApp must be used inside AppProviders");
  return value;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("gn-token");
  });
  const [loading, setLoading] = useState(true);
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const [notice, setNotice] = useState<{ message: string; kind: "success" | "error"; key: number } | null>(null);

  const signIn = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem("gn-token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("gn-token");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const storedToken = token || localStorage.getItem("gn-token");
    if (!storedToken) return;
    const result = await apiRequest<{ user: User }>("/api/auth/me", {}, storedToken);
    setToken(storedToken);
    setUser(result.user);
  }, [token]);

  const notify = useCallback((message: string, kind: "success" | "error" = "success") => {
    setNotice({ message, kind, key: Date.now() });
  }, []);

  useEffect(() => {
    const savedToken = localStorage.getItem("gn-token");
    if (!savedToken) {
      const timer = window.setTimeout(() => setLoading(false), 0);
      return () => window.clearTimeout(timer);
    }
    apiRequest<{ user: User }>("/api/auth/me", {}, savedToken)
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch((caught: unknown) => {
        if (caught instanceof ApiError && caught.status === 401) {
          localStorage.removeItem("gn-token");
          setToken(null);
          return;
        }
        notify("We couldn't verify your saved sign-in. Check your connection; your session is preserved.", "error");
      })
      .finally(() => setLoading(false));
  }, [notify]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      signIn,
      signOut,
      refreshUser,
      theme,
      toggleTheme: () => saveTheme(theme === "light" ? "dark" : "light"),
      notify,
    }),
    [user, token, loading, signIn, signOut, refreshUser, theme, notify],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      {notice && (
        <div className={`toast toast-${notice.kind}`} role="status" key={notice.key}>
          <span>{notice.kind === "success" ? "✓" : "!"}</span>
          {notice.message}
        </div>
      )}
    </AuthContext.Provider>
  );
}
