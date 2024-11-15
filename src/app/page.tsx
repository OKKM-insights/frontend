"use client"; // Required if using Next.js app router with interactivity

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';

const Home: React.FC = () => {
    return (
      <>
        <Header status='not_logged_in' />
        <main className="relative flex flex-col items-center justify-center flex-grow min-h-[90vh] bg-black text-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/satellite-image.png"
              alt="Satellite imagery background"
              layout="fill"
              objectFit="cover"
              className="opacity-30"
            />
          </div>
          
          <div className="relative z-10 mb-8 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">OrbitWatch</h1>
            <p className="text-2xl text-white">Advanced Satellite Image Labeling Platform</p>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <button className="px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded hover:bg-green-700">
              Get Started
            </button>
            <button className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 border border-blue-500 rounded hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </main>
      </>
    );
};

export default Home;
