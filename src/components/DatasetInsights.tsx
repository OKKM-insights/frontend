import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DataInsightsProps } from '@/types';

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

export default function DataInsights({ categoryData , totalLabels }: DataInsightsProps) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const dataWithPercentage = categoryData.map(({name, value}) => ({
      name,
      value: Math.round(value/totalLabels * 100),
    }))
    return (
        <Card className="col-span-2 bg-gray-800 text-white h-fit">
          <CardHeader>
            <CardTitle>Dataset Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-white">Category Breakdown</h3>
                <ChartContainer config={{
                  category: {
                    label: "Category",
                    color: "hsl(var(--chart-1))",
                  },
                  value: {
                    label: "Count",
                    color: "hsl(var(--chart-2))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataWithPercentage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="70%"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<PercentTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2 text-white">Image Types</h3>
                <ChartContainer config={{
                  resolution: {
                    label: "Resolution",
                    color: "hsl(var(--chart-1))",
                  },
                  count: {
                    label: "Count",
                    color: "hsl(var(--chart-2))",
                  },
                }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData.map(({name, value}) => ({
                        resolution: name.charAt(0).toUpperCase() + name.slice(1),
                        count: value,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="resolution" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
    )
}