import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DataInsightsProps } from '@/types';

interface MapInsightsProps {
    id: string | string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PercentTooltipContent = ({ active, payload }: any) => {
    console.log(payload)
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="flex flex-col gap-0.5 text-center">
                    <span className="text-muted-foreground">{payload[0].name}</span>
                    <span className="font-bold text-black">{`${payload[0].value}%`}</span>
                </div>
            </div>
        )
    }
    return null
}

export default function MapInsights({ id }: MapInsightsProps) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const [imageError, setImageError] = useState(false);
    const project_id = id;
    return (
        <Card className="col-span-2 bg-gray-800 text-white h-fit">
            <CardHeader>
                <CardTitle> Image labels for project: {id.toString()} </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-4">
                    {!imageError ? (
                        <img
                            src={`https://label.orbitwatch.xyz/api/get_original_image?projectId=${id}`}
                            // src={`http://localhost:5050/api/get_original_image?projectId=${id}`}
                            alt="Project map image"
                            className="max-w-full h-auto rounded-md shadow-lg border border-gray-700"
                            style={{ maxHeight: '400px' }}
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <img
                                src="/fallback-map.png"
                                alt="Fallback map image"
                                className="max-w-full h-auto rounded-md shadow-lg border border-gray-700"
                                style={{ maxHeight: '400px' }}
                            />
                            <p className="text-gray-400 mt-2">Original map image unavailable</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}