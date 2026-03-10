import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "super_admin" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const DEMO_USERS: { email: string; password: string; name: string; role: UserRole }[] = [
  { email: "superadmin@tirefleet.com", password: "admin123", name: "System Owner", role: "super_admin" },
  { email: "admin@tirefleet.com", password: "admin123", name: "Operations Manager", role: "admin" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore authentication state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const found = DEMO_USERS.find(
      (u) => u.email === email && u.password === password && u.role === role
    );
    if (found) {
      const newUser = { id: crypto.randomUUID(), email: found.email, name: found.name, role: found.role };
      setUser(newUser);
      localStorage.setItem("auth_user", JSON.stringify(newUser));
      return true;
    }
    // Allow any credentials for demo
    const newUser = { id: crypto.randomUUID(), email, name: email.split("@")[0], role };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    return true;
  };

  const signup = (name: string, email: string, _password: string, role: UserRole): boolean => {
    const newUser = { id: crypto.randomUUID(), email, name, role };
    setUser(newUser);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
