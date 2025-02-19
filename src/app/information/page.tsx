"use client";

import Header from '@/components/Header';
import UserInfo from '@/components/UserInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext';

const InfoPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, router, loading]);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
        <Header status='logged_in' />
        <div className="flex items-center justify-center mx-auto p-8 bg-black min-h-[90vh]">
            <UserInfo userType={user.userType} />
        </div>
    </>
    
  );
};

export default InfoPage;