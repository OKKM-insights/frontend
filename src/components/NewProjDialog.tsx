import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function NewProjDialog() {
  const [imageSource, setImageSource] = useState<'upload' | 'request'>('upload')
  const [open, setOpen] = useState(false)

  const closeDialog = (e : React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    setOpen(false)
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="min-h-[48px] w-full p-3 rounded-md text-white bg-blue-600 hover:bg-blue-700">Create New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-white">Create New Project</DialogTitle>
        </DialogHeader>
        <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-6 pt-2 custom-scrollbar">
          <form className="space-y-4">
            <div>
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" className="bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="project-description">Project Description</Label>
              <Textarea id="project-description" className="bg-gray-700 text-white border-gray-600" />
            </div>
            <div>
              <Label>Image Source</Label>
              <RadioGroup defaultValue="upload" onValueChange={(value) => setImageSource(value as 'upload' | 'request')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload" />
                  <Label htmlFor="upload">Upload Images</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request" id="request" />
                  <Label htmlFor="request">Request Images</Label>
                </div>
              </RadioGroup>
            </div>
            {imageSource === 'upload' ? (
              <div>
                <Label htmlFor="image-upload" className="block mb-2">Upload Images</Label>
                <div>
                  <Input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="min-h-[45px] bg-gray-700 text-white border-gray-600 cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., New York City" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label htmlFor="radius">Radius (km)</Label>
                  <Input id="radius" type="number" placeholder="e.g., 10" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Input id="timeframe" placeholder="e.g., Last 6 months" className="bg-gray-700 text-white border-gray-600" />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="analysis-goal">What are you looking to find in these images?</Label>
              <Textarea id="analysis-goal" className="bg-gray-700 text-white border-gray-600" />
            </div>
            <div className="border-t border-gray-600 pt-4">
              <Label>Total Estimated Cost</Label>
              <p className="text-lg font-semibold text-green-400">$XXX.XX</p>
              <p className="text-sm text-gray-400">Final cost may vary based on project complexity</p>
            </div>
          </form>
        </div>
        <div className="p-6 pt-2 border-t border-gray-700">
          <Button type="submit" onClick={closeDialog} className="w-full bg-blue-600 hover:bg-blue-700 text-white">Create Project</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}