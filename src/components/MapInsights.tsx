import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MapInsightsProps {
    id: string | string[];
}

export default function MapInsights({ id }: MapInsightsProps) {
    const [imageError, setImageError] = useState(false);
    return (
        <Card className="col-span-2 bg-gray-800 text-white h-fit">
            <CardHeader>
                <CardTitle> Image labels for project: {id.toString()} </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center mb-4">
                    {!imageError ? (
                        <img
                            src={`https://api.orbitwatch.xyz/api/get_original_image?projectId=${id}`}
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