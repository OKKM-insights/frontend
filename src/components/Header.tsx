// components/Header.tsx
"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
    console.log("Hello")
  };

  return (
    <header className="flex items-center justify-between h-10vh p-4 bg-gray-900">
      <div className="flex items-center">
        <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
          <Image
            src="/images/globe-icon.png"
            alt="EarthLabel Logo"
            width={24}
            height={24}
            className="text-black"
          />
        </div>
        <span className="ml-4 text-2xl font-bold text-white">OrbitWatch</span>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 text-white bg-green-600 border border-green-500 rounded hover:bg-green-700">
          Register
        </button>
        <button
          className="px-4 py-2 text-white bg-blue-600 border border-blue-500 rounded hover:bg-blue-700"
          onClick={goToLogin}
        >
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
