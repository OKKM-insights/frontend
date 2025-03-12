"use client"

import React from 'react';
import ProjectSection from '@/components/ProjectSection';
import ProjectTile from '@/components/ProjectTile';
import { Project } from '@/types';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const LabelHub: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && !(user?.userType === "labeller")) {
      router.push('/');
    }
  }, [user, router, loading]);
  
  useEffect(() => {
    if (!loading) {
      //const url = `http://localhost:5050/api/projects?userId=${user?.id}`
      const url = `https://api.orbitwatch.xyz/api/projects?userId=${user?.id}`
      axios
        .get(url)
        .then((response) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updatedProjects = response.data.projects.map((project: any) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            progress: parseInt(project.progress),
            status: parseInt(project.progress) === 0 ? "live" : "inprogress",
            type: "label",
          }));
          setProjects(updatedProjects);
          setLoadingProjects(false);
        })
        .catch((error) => {
          setError(error.response?.data?.error || "Failed to load projects");
        });
    }
  }, [loading]);

  if (!user || loadingProjects) {
    return <LoadingSpinner />;
  }

  if (error) return <p>Error: {error}</p>;
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