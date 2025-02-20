"use client";

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import {Database, CheckCircle, Brain, Building2, AlertTriangle, Droplet, Leaf} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const useCases = [
    { name: 'Public Infrastructure', icon: Building2 },
    { name: 'Disaster Response', icon: AlertTriangle },
    { name: 'Oil and Gas', icon: Droplet },
    { name: 'Wildlife', icon: Leaf },
  ]

const LearnMore: React.FC = () => {
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
              loading="eager"
            />
          </div>
          <div className='relative z-10'>
            <section className="max-w-4xl mx-auto mb-16 mt-16">
                <h1 className="text-4xl font-bold text-white mb-6">OrbitWatch is a Collective Intelligence Platform</h1>
                <p className="text-lg text-white leading-relaxed">
                Everything in the world is changing all the time. The world of today is quite different from the world of yesterday and will be very different from the world of tomorrow, whether it is due to man-made events or natural phenomena. Organizations of all sizes can do more with geospatial data thanks to Orbitwatch. High resolution satellite imagery is the foundation for our state-of-the-art Machine Learning models and our extremely accurate crowdsourcing data.
                </p>
            </section>

            <section className="max-w-4xl mx-auto mb-16">
                <h2 className="text-3xl text-white font-bold mb-8">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                        <div className="flex items-center space-x-4">
                                <Database className="w-8 h-8 text-blue-500" />
                                <CardTitle className="text-xl text-white font-black">Dataset Creation</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">
                                We specialize in creating comprehensive and accurate datasets from satellite imagery, tailored to your specific needs and requirements.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <CheckCircle className="w-8 h-8 text-blue-500" />
                                <CardTitle className="text-xl text-white font-black">Data Validation</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">
                                Our expert team ensures the quality and reliability of your geospatial data through rigorous validation processes and advanced algorithms.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <Brain className="w-8 h-8 text-blue-500" />
                                <CardTitle className="text-xl text-white font-black">Training Sets</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">
                                We provide high-quality training sets for machine learning models, enabling you to develop more accurate and efficient AI solutions for geospatial analysis.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="max-w-4xl mx-auto">
                <h2 className="text-3xl text-white font-bold mb-6">Customizable end-to-end solutions providing a richer view into geospatial data</h2>
                <p className="text-lg text-white leading-relaxed mb-8">
                    {"There are many applications for OrbitWatch that are not limited to any one project or industry. Government agencies, commercial enterprises, non-governmental groups, and emergency response services can all benefit from the insights that OrbitWatch offer. OrbitWatch campaigns may address the difficult questions and offer quick situational awareness to shorten time to action, whether it's monitoring wildlife populations, developing training tools for machine learning, or documenting damage following a natural catastrophe."}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {useCases.map((UseCase, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="bg-gray-800 rounded-full p-4 mb-4">
                                <UseCase.icon className="w-12 h-12 text-blue-500" />
                            </div>
                            <p className="text-center text-white font-semibold">{UseCase.name}</p>
                        </div>
                    ))}
                </div>
            </section>
          </div>
          
        </main>
      </>
    );
};

export default LearnMore;