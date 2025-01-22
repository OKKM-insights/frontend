"use client"; // Required if using Next.js app router with interactivity

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Home: React.FC = () => {
    const [src, setSrc] = useState("/images/satellite-image.png")
    useEffect(() => {
      fetch('https://api.orbitwatch.xyz/api/image')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        console.log(response)
        return response.blob(); // Get the image as a Blob
      })
      .then(blob => {
        // Convert the Blob into a local URL
        const imageObjectURL = URL.createObjectURL(blob);
        setSrc(imageObjectURL)
      })
      .catch(error => {
        console.error('Error fetching the image:', error);
      });
    }, [])
    
    return (
      <>
        <Image id='myImage' alt="test" width="600" height="600" src={src} />
      </>
    );
};

export default Home;
