import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle, Upload, Edit, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Client, Labeller } from '@/types'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'


interface UserInfoProps {
    userType: 'labeller' | 'client';
}

export default function UserInfo({ userType}: UserInfoProps) {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const [profilePicture, setProfilePicture] = useState<string>(`data:image/png;base64,${user?.profilePicture}`)
  const [dupEmail, setDupEmail] = useState("")

  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const formValues = Object.fromEntries(formData.entries())
    let updatedUser = null
    if (user?.userType === "labeller"){
      updatedUser = {
        ...user,
        profilePicture: profilePicture.replace(/^data:image\/[a-zA-Z]+;base64,/, ""),
        email: formValues.email,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        skills: formValues.skills,
        availability: parseInt(String(formValues.availability))
      }
    } else if (user?.userType === "client"){
      updatedUser = {
        ...user,
        profilePicture: profilePicture.replace(/^data:image\/[a-zA-Z]+;base64,/, ""),
        email: formValues.email,
        name: formValues.name,
        industry: formValues.industry,
        typicalProj: formValues.typicalProj,
      }
    }

    //const url = `http://localhost:5050/api/update-user/${user?.id}`
    const url = `https://api.orbitwatch.xyz/api/update-user/${user?.id}`
    axios.put(url, updatedUser, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (response.status === 200) {
        if (user?.userType === "labeller"){
          setUser(updatedUser as Labeller)
        } else if (user?.userType === "client"){
          setUser(updatedUser as Client)
        }
        setIsEditing(false)
      } else {
        console.error("Failed to submit the form")
      }
    }).catch(err => {
      console.error(err)
      if (err.response.data.error.includes("Duplicate entry")){
        setDupEmail("Account with this email already exists")
      }
    });
  };

  const handleCancel = () => {
    setProfilePicture(`data:image/png;base64,${user?.profilePicture}`)
    formRef.current?.reset();
    setIsEditing(false)
  }

  return (
      <Card className="w-full max-w-2xl bg-gray-800 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
            <Button variant="ghost" className="text-white hover:text-black" onClick={() => {router.back()}}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>
            <CardTitle className="text-2xl font-bold">User Information</CardTitle>
            <Button variant="ghost" onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300" style={{ visibility: isEditing ? 'hidden' : 'visible' }}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
            </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
                <AvatarImage src={profilePicture} alt="Profile" />
                <AvatarFallback>
                  <UserCircle className="w-32 h-32 text-gray-400" />
                </AvatarFallback>
            </Avatar>
            {isEditing && (
              <div>
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  <Button variant="outline" className="flex items-center text-black space-x-2" onClick={() => document.getElementById('profile-picture')?.click()}>
                    <Upload className="w-4 h-4" />
                    <span>Upload Picture</span>
                  </Button>
                </Label>
              </div>
            )}
          </div>

          {/* {!isEditing && (
            <div className="text-center space-y-4">
                {userType === "client" ? (
                    <div className="flex justify-center space-x-4">
                        <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Change Password
                        </Button>
                    </div>
                ) : 
                    <>
                        <div>
                            <span className="text-lg text-gray-400">Current Balance:</span>
                            <span className="ml-2 text-2xl font-bold">$XXXX.XX</span>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <Button variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
                            Withdraw Balance
                            </Button>
                            <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Change Password
                            </Button>
                        </div>
                    </>
                }
            </div>
          )} */}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                className="bg-gray-700 text-white border-gray-600"
                defaultValue={user?.email}
                disabled={!isEditing}
                required
              />
              {dupEmail && (
                  <p className="text-red-500 text-sm">{dupEmail}</p>)}
            </div>

            {userType === 'labeller' ? (
              <>
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        className="bg-gray-700 text-white border-gray-600"
                        defaultValue={(user as Labeller).firstName}
                        disabled={!isEditing}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        className="bg-gray-700 text-white border-gray-600"
                        defaultValue={(user as Labeller).lastName}
                        disabled={!isEditing}
                        required
                    />
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    name="skills"
                    className="bg-gray-700 text-white border-gray-600"
                    defaultValue={(user as Labeller).skills}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability (hours per week)</Label>
                  <Input
                    id="availability"
                    name="availability"
                    type="number"
                    className="bg-gray-700 text-white border-gray-600"
                    defaultValue={(user as Labeller).availability}
                    disabled={!isEditing}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    className="bg-gray-700 text-white border-gray-600"
                    defaultValue={(user as Client).name}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    name="industry"
                    className="bg-gray-700 text-white border-gray-600"
                    defaultValue={(user as Client).industry}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Typical Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    name="typicalProj"
                    className="bg-gray-700 text-white border-gray-600"
                    defaultValue={(user as Client).typicalProj}
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}

            {isEditing && (
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
                <Button type="button" onClick={handleCancel} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
  )
}