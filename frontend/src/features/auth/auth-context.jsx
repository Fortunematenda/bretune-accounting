import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { clearTokens, getAccessToken, setTokens } from "./token-store";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()));

  function updateUser(patch) {
    setUser((prev) => {
      const base = prev && typeof prev === "object" ? prev : {};
      const merged = { ...base, ...(patch && typeof patch === "object" ? patch : {}) };
      try {
        localStorage.setItem("ba_user", JSON.stringify(merged));
      } catch {
        // ignore
      }
      return merged;
    });
  }

  useEffect(() => {
    let mounted = true;
    const token = getAccessToken();

    if (!token) return undefined;

    // Always fetch profile when we have a token - user identity is by email/id, not cached name
    api
      .profile()
      .then((payload) => {
        if (!mounted) return;
        const next = payload?.user && typeof payload.user === "object" ? payload.user : payload;
        if (next && typeof next === "object") {
          setUser(next);
          try {
            localStorage.setItem("ba_user", JSON.stringify(next));
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        if (!mounted) return;
        clearTokens();
        try {
          localStorage.removeItem("ba_user");
        } catch {
          // ignore
        }
        setIsAuthenticated(false);
        setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    setIsAuthenticated(true);
    setUser(data.user);
    try {
      localStorage.setItem("ba_user", JSON.stringify(data.user));
    } catch {
      // ignore
    }
    return data;
  }

  function logout() {
    clearTokens();
    try {
      localStorage.removeItem("ba_user");
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
