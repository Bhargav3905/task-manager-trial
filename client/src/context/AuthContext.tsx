import { createContext, useState, type ReactNode } from "react";
import api from "../services/api";
import type { User } from "../types/auth";

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
