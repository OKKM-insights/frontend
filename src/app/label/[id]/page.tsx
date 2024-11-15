"use client"

import React from 'react';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const LabelStudioUI = dynamic(() => import('../../../components/LabelStudioUI'), {
  ssr: false,
});

const Label: React.FC = () => {
  const { title } = useParams(); // eslint-disable-line @typescript-eslint/no-unused-vars
  return (
    <>
        <Header status='logged_in'/>
        <div className="bg-black min-h-[90vh]">
            <LabelStudioUI />
        </div>
    </>
    
  );
};

export default Label;