"use client"; // Required if using Next.js app router with interactivity

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PhotoLabelingTool from './PhotoLabelingTool';

const Home: React.FC = () => {
    return (
      <>
        <PhotoLabelingTool imageUrl='https://www.hok.com/wp-content/uploads/2019/05/Suvarnabhumi-International-Airport-Midfield-Satellite-Concourse_Aerial_1900-1600x1069.jpg' onSubmit={()=>{}} onSkip={()=>{}} />
      </>
    );
};

export default Home;
