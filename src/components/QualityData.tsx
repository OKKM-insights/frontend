import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from 'next/image';
import { QualityDataProps } from '@/types';


export default function QualityData({accuracyRate, disputedLabels, reviewProgress} : QualityDataProps) {
    
    return (
        <Card className="bg-gray-800 text-white h-fit">
          <CardHeader>
            <CardTitle>Quality Assurance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <div>
                <h3 className="font-semibold text-white">Accuracy Rate</h3>
                <p>{accuracyRate}%</p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Disputed Labels</h3>
                <p>{disputedLabels}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-1 text-white">Review Progress</h3>
              <Progress value={reviewProgress} className="w-full" />
              <p className="text-xs text-gray-400 mt-1">{reviewProgress}% Reviewed</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Image src="/images/airport_1.png" width={100} height={100} alt="Correct Label Example" className="rounded-md" />
                <p className="text-xs text-green-400 mt-1">Correct Label</p>
              </div>
              <div>
                <Image src="/images/airport_1.png" width={100} height={100} alt="Disputed Label Example" className="rounded-md" />
                <p className="text-xs text-red-400 mt-1">Disputed Label</p>
              </div>
            </div>
          </CardContent>
        </Card>
    )
}