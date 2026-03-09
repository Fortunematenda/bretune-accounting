import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { clearTokens, getAccessToken, getStoredUser, setStoredUser, setTokens } from '../lib/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const token = await getAccessToken();
      const cachedUser = await getStoredUser();

      if (!mounted) return;

      if (cachedUser) setUser(cachedUser);
      setIsAuthenticated(Boolean(token));

      if (!token) {
        setBooting(false);
        return;
      }

      try {
        const payload = await api.profile();
        const nextUser = payload?.user && typeof payload.user === 'object' ? payload.user : payload;
        if (!mounted) return;
        setUser(nextUser || null);
        await setStoredUser(nextUser || null);
      } catch {
        if (!mounted) return;
        await clearTokens();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        if (mounted) setBooting(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function login(email, password) {
    const data = await api.login(email, password);
    await setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    await setStoredUser(data.user);
    setUser(data.user || null);
    setIsAuthenticated(true);
    return data;
  }

  async function logout() {
    await clearTokens();
    setUser(null);
    setIsAuthenticated(false);
  }

  async function updateUser(nextUser) {
    if (nextUser) {
      setUser(nextUser);
      await setStoredUser(nextUser);
    } else {
      // Refetch from server if no user provided
      try {
        const payload = await api.profile();
        const fetchedUser = payload?.user && typeof payload.user === 'object' ? payload.user : payload;
        setUser(fetchedUser || null);
        await setStoredUser(fetchedUser || null);
      } catch {
        // ignore
      }
    }
  }

  const value = useMemo(() => ({ user, booting, isAuthenticated, login, logout, updateUser }), [user, booting, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
