"use client"

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from 'next/navigation'
import axios from "axios";

interface Labeller {
    id: number;
    email: string;
    profilePicture: string;
    first_name: string;
    last_name: string;
    skills: string;
    availability: number;
    user_type: "labeller";
}

interface Client {
  id: number;
  email: string;
  profilePicture: string;
  name: string;
  industry: string;
  typical_proj: string;
  user_type: "client";
}

interface AuthContextType {
  user: Labeller | Client | null;
  login: (email: string, password: string, userType: "labeller" | "client") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Labeller | Client | null>(null);
  // const [token, setToken] = useState<string | null>(null); leave out tokens for now
  const router = useRouter();

  useEffect(() => {
    // Load token/user from localStorage or cookies on initial render
    //const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      //setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string, userType: "labeller" | "client") => {
    //const url = "http://localhost:5050/api/login"
    const url = "https://api.orbitwatch.xyz/api/login"
    return axios
      .post(url, { email, password, userType })
      .then((response) => {
        const data = response.data;
        console.log(data)
        data.user["user_type"] = userType
        setUser(data.user);
        //setToken(data.token);
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
    //setToken(null);
    setUser(null);

    //localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};