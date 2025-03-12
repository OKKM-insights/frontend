"use client"

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";
import { Labeller, Client } from "@/types";

interface AuthContextType {
  user: Labeller | Client | null;
  loading: boolean;
  setUser: (user: Labeller | Client | null) => void;
  login: (email: string, password: string, userType: "labeller" | "client") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Labeller | Client | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string, userType: "labeller" | "client") => {
    //const url = "http://localhost:5050/api/login"
    const url = "https://api.orbitwatch.xyz/api/login"
    return axios
      .post(url, { email, password, userType })
      .then((response) => {
        const data = response.data;
        data.user["userType"] = userType
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        if (userType === "client"){
            router.push("/projects")
        } else if (userType === "labeller") {
            router.push("/label-projects")
        }
      })
      .catch((error) => {
        console.error("Login failed:", error.response?.data?.message || error.message);
        throw {
            status: error.response?.status,
            message: error.response?.data?.message || "Login failed"
          };
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};