import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProgressDataProps } from '@/types';

export default function ProgressData({completionPercentage, labeledPhotos, totalPhotos, timeRemaining} : ProgressDataProps) {
    
    return (
        <Card className="bg-gray-800 text-white h-full flex flex-col">
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-white">Overall Completion</h3>
                <Progress value={completionPercentage} className="w-full" />
                <p className="text-xs text-gray-400 mt-2">{completionPercentage}% Complete</p>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <h3 className="font-semibold mb-1 text-white">Labeled Photos</h3>
                  <p>{labeledPhotos} / {totalPhotos}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Time Remaining</h3>
                  <p>{timeRemaining}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h3 className="text-sm font-semibold mb-2 text-white">Recent Activity</h3>
              <p className="text-xs text-gray-400">Last update: 2 hours ago</p>
            </div>
          </CardContent>
        </Card>
    )
}