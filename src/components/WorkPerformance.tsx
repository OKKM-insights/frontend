import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { WorkPerformanceProps } from '@/types';

export default function WorkPerformance({avgLabelSpeed, totalLabelers, topPerformers} : WorkPerformanceProps) {
    
    return (
        <Card className="bg-gray-800 text-white h-full flex flex-col">
          <CardHeader>
            <CardTitle>Workforce Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between text-sm">
                <div>
                  <h3 className="font-semibold mb-1 text-white">Avg. Labeling Speed</h3>
                  <p>{avgLabelSpeed} seconds</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Total Labelers</h3>
                  <p>{totalLabelers}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-white">Top Performers</h3>
                <div className="space-y-2">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{performer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-xs">{performer.name}</p>
                        <p className="text-xs text-gray-400">{performer.contribution} images</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{performer.accuracy}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    )
}