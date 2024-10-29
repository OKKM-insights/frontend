"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginBox: React.FC = () => {
  const [loginType, setLoginType] = useState<'labeler' | 'client'>('labeler');
  const router = useRouter();

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginType === 'client') {
      router.push('/projects');
    } else {
      router.push('/label-projects');
    }
  };

  return (
      <div className="relative z-10 w-full max-w-md p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-white">Login to OrbitWatch</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <button
            className={`px-5 py-2 text-lg ${loginType === 'labeler' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
            onClick={() => setLoginType('labeler')}
          >
            Labeler
          </button>
          <button
            className={`px-5 py-2 text-lg ${loginType === 'client' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
            onClick={() => setLoginType('client')}
          >
            Client
          </button>
        </div>

        {/* Login Form */}
        <form className="flex flex-col gap-4" onSubmit={login}>
          <div className="flex flex-col">
            <label htmlFor="clientEmail" className="mb-2 text-white text-left">Email</label>
            <input
              id="clientEmail"
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="clientPassword" className="mb-2 text-white text-left">Password</label>
            <input
              id="clientPassword"
              type="password"
              placeholder="Enter your password"
              className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
            Sign In
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 text-center">
          <a href="/forgot-password" className="text-blue-400 hover:text-blue-500">Forgot password?</a>
        </div>
        <div className="mt-6 text-center">
          <p className="text-white">Don't have an account? <a href="/register" className="text-green-400 hover:text-green-500">Register here</a></p>
        </div>
      </div>
  );
};

export default LoginBox;