"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface HeaderProps {
  status: "not_logged_in" | "logged_in";
}

const Header: React.FC<HeaderProps> = ({status}) => {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToHome = () => {
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between h-[10vh] p-4 bg-gray-900">
      <div onClick={goToHome} className="flex items-center cursor-pointer">
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
        {status === "logged_in" ?
          <>
            <Button
              variant="ghost"
              className="text-white hover:text-green-400 flex items-center space-x-2"
              onClick={goToHome}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>
                <UserCircle className="w-6 h-6 text-gray-400" />
              </AvatarFallback>
            </Avatar>
          </>
        : 
          <>
            <button className="px-4 py-2 text-white bg-green-600 border border-green-500 rounded hover:bg-green-700">
              Register
            </button>
            <button
              className="px-4 py-2 text-white bg-blue-600 border border-blue-500 rounded hover:bg-blue-700"
              onClick={goToLogin}
            >
              Login
            </button>
          </>
          
        }
      </div>
    </header>
  );
};

export default Header;
