"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "../context/AuthContext"

const LoginBox: React.FC = () => {
  const [userType, setUserType] = useState<'labeller' | 'client'>('labeller');
  const [wrongCredsError, setCredsError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const formValues = Object.fromEntries(formData.entries())
    console.log(formValues)
    setCredsError("");

    // Tell users when credentials are incorrect
    try {
      const userData = await login(String(formValues['email']), String(formValues['password']), userType);
      console.log("Logged in user data:", userData);
    } catch (err) {
      const error = err as { status?: number; message?: string };
      setCredsError(
        error.status === 401
          ? "Invalid credentials. Please try again"
          : error.message || "An error occurred while logging in."
      );
    }
  };

  return (
      <div className="relative z-10 w-full max-w-md p-9 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-white">Login to OrbitWatch</h1>
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-5 py-2 text-lg ${userType === 'labeller' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
            onClick={() => setUserType('labeller')}
          >
            Labeller
          </button>
          <button
            className={`px-5 py-2 text-lg ${userType === 'client' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
            onClick={() => setUserType('client')}
          >
            Client
          </button>
        </div>

        {/* Login Form */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="flex flex-col">
            <Label htmlFor="clientEmail" className="mb-2 text-lg text-white text-left">Email</Label>
            <Input
              id="clientEmail"
              type="email"
              name='email'
              placeholder="Enter your email"
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <Label htmlFor="clientPassword" className="mb-2 text-lg text-white text-left">Password</Label>
            <Input
              id="clientPassword"
              type="password"
              name='password'
              placeholder="Enter your password"
              className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {wrongCredsError && (
                  <p className="text-red-500 text-sm">{wrongCredsError}</p>)}

          <button type="submit" className="w-full py-3 mt-4 text-base font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
            Sign In
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-center">
          <span onClick={() => router.push("/forgot-password")} className="text-blue-400 hover:text-blue-500 cursor-pointer">Forgot password?</span>
        </div>
        <div className="mt-2 text-center">
          <p className="text-white">Need an account? <span onClick={() => router.push("/register")} className="text-green-400 hover:text-green-500 cursor-pointer">Register here</span></p>
        </div>
      </div>
  );
};

export default LoginBox;