"use client";

import Header from '@/components/Header';
import UserInfo from '@/components/UserInfo';

const Login: React.FC = () => {
  return (
    <>
        <Header status='logged_in' />
        <div className="flex items-center justify-center mx-auto p-8 bg-black min-h-[90vh]">
            <UserInfo userType='labeler' />
        </div>
    </>
    
  );
};

export default Login;