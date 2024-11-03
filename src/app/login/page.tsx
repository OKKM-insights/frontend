"use client";

import LoginBox from '@/components/LoginBox';
import Image from 'next/image';
import Header from '@/components/Header';

const Login: React.FC = () => {
  return (
    <>
        <Header status='not_logged_in' />
        <main className="relative flex flex-col items-center justify-center flex-grow min-h-[90vh] p-4 bg-black text-center">
            <div className="absolute inset-0 z-0">
                <Image
                src="/images/satellite-image.png"
                alt="Satellite imagery background"
                layout="fill"
                objectFit="cover"
                className="opacity-30"
                />
            </div>
            <LoginBox />
        </main>
    </>
    
  );
};

export default Login;