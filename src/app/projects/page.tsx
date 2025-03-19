"use client"

import React, { useState } from "react";
import ProjectSection from "@/components/ProjectSection";
import { Project } from "@/types";
import Header from "@/components/Header";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext';
import axios from "axios"

const ProjectHub: React.FC = () => {
  // const projects: Project[] = [
  //   { id: "1", title: "New Satellite Imagery", description: "Fresh data from EarthSat-3", status: "new" , type: 'client'},
  //   { id: "2", title: "Urban Development", description: "Tracking city growth", status: "current", progress: 60, type: 'client' },
  //   { id: "3", title: "Forest Cover Analysis", description: "Annual deforestation report", status: "current", progress: 85, type: 'client' },
  //   { id: "4", title: "Coastal Erosion Study", description: "5-year comparison", status: "finished", type: 'client' },
  //   { id: "6", title: "Climate Change Impact", description: "Glacier retreat analysis", status: "finished", type: 'client' },
  //   { id: "8", title: "Desert Expansion Tracking", description: "Monitoring arid region growth", status: "current", progress: 40, type: 'client'},
  //   { id: "9", title: "Urban Heat Island Effect", description: "Temperature variation in cities", status: "finished", type: 'client'},
  //   { id: "10", title: "Polar Ice Cap Monitoring", description: "Annual ice coverage assessment", status: "current", progress: 75, type: 'client'},
  // ];
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [reloadKey, setReloadKey] = useState(0);
  const { user, loading } = useAuth();
  const router = useRouter();

  const triggerReload = () => {
    setReloadKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    if (!loading && !(user?.userType === "client")) {
      router.push('/');
    }
  }, [user, router, loading]);

  useEffect(() => {
    if (!loading){
      setLoadingProjects(true);
      //const url = `https://api.orbitwatch.xyz/api/client_projects?clientId=${user?.id}`
      const url = `http://localhost:5050/api/client_projects?clientId=${user?.id}`
      axios
        .get(url)
        .then((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updatedProjects : Project[] = response.data.projects.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            progress: Math.min(Math.ceil(project.progress / 2), 100),
            status: Math.min(Math.ceil(project.progress / 2), 100) === 100 ? "finished" : "current",
            type: "client",
          }));
          updatedProjects.push({ id: "99999", title: "New Satellite Imagery", description: "Fresh data from EarthSat-3", status: "new" , type: 'client'})
          setProjects(updatedProjects);
          setLoadingProjects(false);
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
          setError(error.response?.data?.error || "Failed to load projects");
          setLoadingProjects(false);
        });
    }
  }, [user, reloadKey, loading]);

  if (!user || loadingProjects) {
    return <LoadingSpinner />;
  }

  if (error) return <p>Error: {error}</p>;
  return (
    <>
      <Header status="logged_in"/>
      <div className="mx-auto p-8 bg-black min-h-[90vh]">
        <h1 className="text-4xl font-bold mb-8 text-white">Projects Dashboard</h1>
        <ProjectSection triggerReload={triggerReload} title="New Projects" projects={projects.filter(p => p.status === "new")} color="#3b82f6" />
        <ProjectSection title="Current Projects" projects={projects.filter(p => p.status === "current")} color="#22c55e" />
        <ProjectSection title="Finished Projects" projects={projects.filter(p => p.status === "finished")} color="#9ca3af" />
      </div>
    </>
    
  );
};

export default ProjectHub;