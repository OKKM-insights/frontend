"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { HeaderProps } from '@/types';
import { useAuth } from "../context/AuthContext"

const Header: React.FC<HeaderProps> = ({status}) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const goToHome = () => {
    router.push('/');
  };

  const goToInfo = () => {
    router.push('/information');
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
      <div className="flex items-center space-x-2">
        {status === "logged_in" ?
          <>
            {/* <div className="text-white mr-4">
              <span className="ml-1 font-semibold">$XXXX.XX</span>
            </div> */}
            <Avatar onClick={goToInfo} className="cursor-pointer">
              <AvatarImage src={`data:image/png;base64,${user?.profilePicture}`} alt="User" />
              <AvatarFallback>
                <UserCircle className="w-6 h-6 text-gray-400" />
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              className="text-white hover:text-green-400 flex items-center space-x-2"
              onClick={logout}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </>
        : 
          <>
            <button 
              className="px-4 py-2 text-white bg-green-600 border border-green-500 rounded hover:bg-green-700"
              onClick={goToRegister}
            >
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
