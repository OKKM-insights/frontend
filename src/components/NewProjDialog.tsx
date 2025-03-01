import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from '../context/AuthContext'
import { SuccessPopup } from './SuccessPopup'
import axios from "axios"
import { Loader } from 'lucide-react'

export default function NewProjDialog() {
  const [imageSource, setImageSource] = useState<'upload' | 'request'>('upload');
  const [open, setOpen] = useState(false);
  const [projectNameError, setProjectNameError] = useState("");
  const [projectDescError, setProjectDescError] = useState("");
  const [projectCategoryError, setProjectCategoryError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleFormSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault(); // Prevent form from auto-submitting
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("client-id", String(user?.id))
    const formValues = Object.fromEntries(formData.entries());

    // Make sure none of them are white space strings
    if (!String(formValues["project-name"]).trim().length){
      setProjectNameError("Name can not be empty")
    } else{
      setProjectNameError("")
    }

    if (!String(formValues["project-description"]).trim().length){
      setProjectDescError("Desc can not be empty")
    } else{
      setProjectDescError("")
    }

    if (!String(formValues["analysis-goal"]).trim().length){
      setProjectCategoryError("Categories can not be empty")
    } else{
      setProjectCategoryError("")
    }

    console.log(formValues)
    

    // // send request to back end
    //const url = "http://localhost:5050/api/create_project"
    const url = "https://api.orbitwatch.xyz/api/create_project"
    axios.post(url, formData).then(response => {
      if (response.status === 200) {
        console.log("Form submitted successfully")
        // Do something on success, like showing a success message or resetting the form
        setOpen(false)
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 1500);
      } else {
        console.error("Failed to submit the form")
        setProjectError("Project Creation Failed. Please Try Again")
      }
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setProjectError("Project Creation Failed. Please Try Again")
      setLoading(false)
    });
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="min-h-[48px] w-full p-3 rounded-md text-white bg-blue-600 hover:bg-blue-700">Create New Project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white max-h-[90vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl font-bold text-white">New Project</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(90vh-8rem)] overflow-y-auto p-6 pt-2 custom-scrollbar">
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" name='project-name' className="bg-gray-700 text-white border-gray-600" type='text' maxLength={30} required={true}/>
                {projectNameError && (
                    <p className="text-red-500 text-sm">{projectNameError}</p>)}
                
              </div>
              <div>
                <Label htmlFor="project-description">Project Description</Label>
                <Textarea id="project-description" name='project-description' className="bg-gray-700 text-white border-gray-600" maxLength={80} required/>
                {projectDescError && (
                    <p className="text-red-500 text-sm">{projectDescError}</p>)}
              </div>
              <div className="space-y-2">
                <Label htmlFor='end-date'>End Date</Label>
                <Input 
                  id="end-date"
                  name='end-date' 
                  type='date' 
                  className="bg-gray-700 text-white border-gray-600 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{
                    colorScheme: 'dark',
                  }}
                  required
                />
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
                      name='image-upload'
                      type="file"
                      multiple
                      accept="image/*"
                      className="min-h-[45px] bg-gray-700 text-white border-gray-600 cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-white hover:file:bg-gray-500"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name='location' placeholder="e.g., New York City" className="bg-gray-700 text-white border-gray-600" required/>
                  </div>
                  <div>
                    <Label htmlFor="radius">Radius (km)</Label>
                    <Input id="radius" name='radius' type="number" placeholder="e.g., 10" className="bg-gray-700 text-white border-gray-600" required/>
                  </div>
                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Input id="timeframe" name='timeframe' placeholder="e.g., Last 6 months" className="bg-gray-700 text-white border-gray-600" required/>
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="analysis-goal">What are you looking to find in these images?</Label>
                <Textarea id="analysis-goal" name='analysis-goal' className="bg-gray-700 text-white border-gray-600" placeholder='Enter values seperated by commas, e.g. dogs, cats, birds' maxLength={80} required/>
                {projectCategoryError && (
                    <p className="text-red-500 text-sm">{projectCategoryError}</p>)}
              </div>
              <div className="border-t border-gray-600 pt-4">
                <Label>Total Estimated Cost</Label>
                <p className="text-lg font-semibold text-green-400">$232.34</p>
                <p className="text-sm text-gray-400">Final cost may vary based on project complexity</p>
              </div>
              {projectError && (
                    <p className="text-red-500 text-sm">{projectError}</p>)}
              <div className="p-6 pt-2 border-t border-gray-700">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? 
                    <Loader />
                    : "Create Project"
                  }
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      {showSuccessPopup ?
          <SuccessPopup message='Project Created' />
      : <></>}
    </>
  )
}