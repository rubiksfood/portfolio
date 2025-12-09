import { createContext, useContext, useEffect, useState } from "react";

// Use env var for production API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(!!token);

  // On first load, if user has a token, fetch /auth/me
  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setUser(null);
        setInitialLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          // Token invalid/expired
          console.error("Failed to fetch /auth/me:", res.status);
          setToken(null);
          localStorage.removeItem("token");
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Error calling /auth/me:", err);
        setToken(null);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setInitialLoading(false);
      }
    }

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body.message || "Login failed";
      throw new Error(message);
    }

    const data = await res.json();
    setToken(data.token);
    localStorage.setItem("token", data.token);
    // Could immediately fetch /auth/me, or let the effect do it
  };

  const register = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const message = body.message || "Registration failed";
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const value = {
    token,
    user,
    login,
    logout,
    register,
    initialLoading,
    isAuthenticated: !!token,
    API_BASE_URL,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}