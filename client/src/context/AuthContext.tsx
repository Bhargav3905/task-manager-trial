import { createContext, useState, type ReactNode } from "react";
import api from "../services/api";
import type { User } from "../types/auth";
import { useEffect } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    }

    loadUser();
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { user, token } = response.data.data;

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);
  }

  async function register(name: string, email: string, password: string) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const { user, token } = response.data.data;

    localStorage.setItem("token", token);

    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
