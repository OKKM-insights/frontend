"use client"

import React from "react";
import ProjectSection from "@/components/ProjectSection";
import { Project } from "@/types";
import Header from "@/components/Header";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext';

const ProjectHub: React.FC = () => {
  const projects: Project[] = [
    { id: "1", title: "New Satellite Imagery", description: "Fresh data from EarthSat-3", status: "new" , type: 'client'},
    { id: "2", title: "Urban Development", description: "Tracking city growth", status: "current", progress: 60, type: 'client' },
    { id: "3", title: "Forest Cover Analysis", description: "Annual deforestation report", status: "current", progress: 85, type: 'client' },
    { id: "4", title: "Coastal Erosion Study", description: "5-year comparison", status: "finished", type: 'client' },
    { id: "5", title: "Agricultural Yield Prediction", description: "Machine learning model training", status: "new", type: 'client'},
    { id: "6", title: "Climate Change Impact", description: "Glacier retreat analysis", status: "finished", type: 'client' },
    { id: "7", title: "Ocean Temperature Mapping", description: "Global warming effects on marine life", status: "new", type: 'client' },
    { id: "8", title: "Desert Expansion Tracking", description: "Monitoring arid region growth", status: "current", progress: 40, type: 'client'},
    { id: "9", title: "Urban Heat Island Effect", description: "Temperature variation in cities", status: "finished", type: 'client'},
    { id: "10", title: "Polar Ice Cap Monitoring", description: "Annual ice coverage assessment", status: "current", progress: 75, type: 'client'},
  ];
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!(user?.userType === "client")) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Header status="logged_in"/>
      <div className="mx-auto p-8 bg-black min-h-[90vh]">
        <h1 className="text-4xl font-bold mb-8 text-white">Projects Dashboard</h1>
        <ProjectSection title="New Projects" projects={projects.filter(p => p.status === "new")} color="#3b82f6" />
        <ProjectSection title="Current Projects" projects={projects.filter(p => p.status === "current")} color="#22c55e" />
        <ProjectSection title="Finished Projects" projects={projects.filter(p => p.status === "finished")} color="#9ca3af" />
      </div>
    </>
    
  );
};

export default ProjectHub;