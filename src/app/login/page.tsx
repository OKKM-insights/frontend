"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginBox from '@/components/LoginBox';
import Image from 'next/image';
import Header from '@/components/Header';

const Login: React.FC = () => {
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
    <>
        <Header />
        <main className="relative flex flex-col items-center justify-center flex-grow min-h-[89.5vh] p-4 bg-black text-center">
            <div className="absolute inset-0 z-0">
                <Image
                src="/images/satellite-image.png"
                alt="Satellite imagery background"
                layout="fill"
                objectFit="cover"
                className="opacity-50"
                />
            </div>
            <LoginBox />
        </main>
    </>
    
  );
};

export default Login;