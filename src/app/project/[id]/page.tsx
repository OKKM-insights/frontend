/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect} from 'react';
import Header from '@/components/Header';
import ProgressData from '@/components/ProgressData';
import WorkPerformance from '@/components/WorkPerformance';
import DataInsights from '@/components/DatasetInsights';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from 'next/navigation';
import { Download } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import MapInsights from '@/components/MapInsights';

interface UserInfo {
    profile_picture: string;
    first_name: string;
    creation_date: string;
}

interface TopLabeller {
    num_labels: number | null;
    user_info: UserInfo | null;
}

type Stats = {
    progressData: any;
    qualityData: any;
    workforceData: any;
    categoryData: any;
  };

function timeAgo(lastLabelTime: string): string {
    if (lastLabelTime === "0") return "No Labels";
    const lastDate = new Date(lastLabelTime);
    const now = new Date();
    const diffMs = now.getTime() - lastDate.getTime(); // Difference in milliseconds

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return diffDays === 1 ? `${diffDays} day ago` : `${diffDays} days ago`;
}

function timeRemaining(projectEndDate: string): string {
    const endDate = new Date(projectEndDate);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime(); // Difference in milliseconds

    if (diffMs <= 0) return "Project ended";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) return diffDays === 1 ? `${diffDays} day remaining` : `${diffDays} days remaining`;
    if (diffHours > 0) return `${diffHours} hours remaining`;
    return `${diffMinutes} minutes remaining`;
}


const ProjectInsights: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading } = useAuth();
    const [stats, setStats] =  useState<Stats | null>(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {
        if (!loading && !(user?.userType === "client")) {
            router.push('/');
        }
    }, [user, router, loading]);

    useEffect(() => {
        if (!user || !id) return;
        setLoadingStats(true);
        //const url = `https://api.orbitwatch.xyz/api/client_projects?clientId=${user?.id}`
        //const url2 = `http://localhost:5050/api/client_projects?clientId=${user?.id}`
        const url = `https://label.orbitwatch.xyz/1.0/get_report`
        const url2 = `https://api.orbitwatch.xyz/api/client_projects?clientId=${user?.id}`
      
        // retrieve the stats for a project to display
        Promise.all([
            axios.get(url2),
            axios.get(url, {headers: {"projectId": id,}})
        ]).then(([projectsResponse, reportResponse]) => {
            const stats = reportResponse.data;
            const progress = projectsResponse.data.projects.find((project:any) => project.id.toString() === id)?.progress;
            const progressData = {
                completionPercentage: progress ?? 0,
                recentActivity: timeAgo(stats.last_label_time),
                timeRemaining: timeRemaining(stats.project_end_date)
            }
        
            const qualityData = {
                accuracyRate: 92,
                disputedLabels: 215,
                reviewProgress: 70
            }
            const workforceData = {
                avgLabel: Math.round(stats.avg_num_labels),
                totalLabelers: stats.num_labellers,
                topPerformers : Object.values(stats.top_labellers as Record<number, TopLabeller> || {})
                                        .filter((info: TopLabeller) => info.num_labels !== null)
                                        .map((info: TopLabeller) => ({
                                            name: info.user_info ? info.user_info.first_name : "Unknown",
                                            contribution: info.num_labels!,
                                            profile: info.user_info?.profile_picture ? info.user_info.profile_picture : ""
                                        }))
            }
            
            const categoryData = {
                categoryData : Object.entries(stats.category_data)
                                        .map(([name, value]) => ({
                                            name,
                                            value
                                        })),
                totalLabels: stats.num_labels
            }

            const data = {progressData, qualityData, workforceData, categoryData};
            setStats(data);
            setLoadingStats(false);

        })
        .catch((error) => {
          console.error(error);
          setError(error.response?.data?.error || "Failed to load project stats");
          setLoadingStats(false);
        });
    }, [user, id, loading]);

    if (!user || loadingStats) {
        return <LoadingSpinner />;
    }

    if (error) return <p>Error: {error}</p>;
    return (
        <>
            <Header status='logged_in'/>
            <div className="bg-black min-h-[90vh] p-8">
                <div className="flex items-center mb-6">
                    <Button variant="ghost" onClick={router.back} className="mr-2 group">
                        <ArrowLeft className="h-4 w-4 text-white group-hover:text-black" />
                    </Button>
                    <h1 className="text-3xl font-bold text-center text-white">Project Information</h1>
                    <Button
                        onClick={() => {}}
                        className="ml-auto group bg-white text-black"
                        disabled={stats?.progressData.completionPercentage !== 100}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export Results
                    </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                    <ProgressData {...stats?.progressData} />
                    <WorkPerformance {...stats?.workforceData} />
                    <DataInsights {...stats?.categoryData} />
                    <MapInsights id = {id} />
                </div>
            </div>
        </>
    );
};

export default ProjectInsights;