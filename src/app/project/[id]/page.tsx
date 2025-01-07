"use client"

import React from 'react';
import Header from '@/components/Header';
import ProgressData from '@/components/ProgressData';
import WorkPerformance from '@/components/WorkPerformance';
import DataInsights from '@/components/DatasetInsights';
import QualityData from '@/components/QualityData';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';


const ProjectInsights: React.FC = () => {
    const router = useRouter();
    const progressData = {
        completionPercentage: 100,
        labeledPhotos: 6500,
        totalPhotos: 10000,
        timeRemaining: "3 days 5 hours"
    }

    const qualityData = {
        accuracyRate: 92,
        disputedLabels: 215,
        reviewProgress: 70
    }
    const workforceData = {
        avgLabelSpeed: 45,
        totalLabelers: 12,
        topPerformers: [
            { name: "Alice", contribution: 1200, accuracy: 98 },
            { name: "Bob", contribution: 1100, accuracy: 97 },
            { name: "Charlie", contribution: 1000, accuracy: 96 }
        ]
    }
    
    const categoryData = [
        { name: 'Building', value: 4000 },
        { name: 'Vehicle', value: 3000 },
        { name: 'Vegetation', value: 2000 },
        { name: 'Water', value: 1000 },
    ]
    return (
        <>
            <Header status='logged_in'/>
            <div className="bg-black min-h-[90vh] p-8">
                <div className="flex items-center mb-6">
                    <Button variant="ghost" onClick={router.back} className="mr-2 group">
                        <ArrowLeft className="h-4 w-4 text-white group-hover:text-black" />
                    </Button>
                    <h1 className="text-3xl font-bold text-center text-white">Project Information</h1>
                    {progressData.completionPercentage === 100 && <Button
                        onClick={() => console.log("Right Button Clicked")}
                        className="ml-auto group bg-white text-black"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export Results
                    </Button>}
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <ProgressData {...progressData} />
                    <WorkPerformance {...workforceData} />
                    <DataInsights categoryData={categoryData} />
                    <QualityData {...qualityData} />
                </div>
            </div>
        </>
    );
};

export default ProjectInsights;