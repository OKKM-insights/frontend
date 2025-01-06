"use client"

import React from 'react';
import ProjectSection from '@/components/ProjectSection';
import ProjectTile from '@/components/ProjectTile';
import { Project } from '@/types';
import Header from '@/components/Header';

const LabelHub: React.FC = () => {
  const projects: Project[] = [
    { id: '1', title: 'Tutorial', description: 'Fresh data from EarthSat-3', status: 'live' },
    { id: '2', title: 'New Airport Imagery', description: 'Fresh data from EarthSat-3', status: 'live' },
    { id: '3', title: 'Urban Development', description: 'Tracking city growth', status: 'inprogress', progress: 60 },
    { id: '4', title: 'Coastal Erosion Study', description: '5-year comparison', status: 'live' },
    { id: '5', title: 'Agricultural Yield Prediction', description: 'Machine learning model training', status: 'live' },
    { id: '6', title: 'Climate Change Impact', description: 'Glacier retreat analysis', status: 'live' },
    { id: '7', title: 'Ocean Temperature Mapping', description: 'Global warming effects on marine life', status: 'live' },
    
  ];

  return (
    <>
        <Header status='logged_in'/>
        <div className="mx-auto p-8 bg-black min-h-[90vh]">
            <h1 className="text-4xl font-bold mb-8 text-white">Projects</h1>
            {projects.some(p => p.status === 'inprogress') && (
                <ProjectSection title="In Progress" projects={projects.filter(p => p.status === 'inprogress')} color="#22c55e" />
            )}
            <section>
              <h2 className="text-2xl font-semibold mb-4" style={{ color: "#3b82f6" }}>Live Projects</h2>
              <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                {projects.filter(p => p.status === "live").map((project) => (
                  <ProjectTile key={project.id} project={project} />
                ))}
              </div>
            </section>
        </div>
    </>
    
  );
};

export default LabelHub;