import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle, Upload, Edit, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation';



interface UserInfoProps {
    userType: 'labeler' | 'client';
}

export default function UserInfo({ userType }: UserInfoProps) {
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    skills: 'Image Classification, Object Detection',
    availability: '40',
    companyName: 'Acme Inc.',
    industry: 'Technology',
    projectDescription: 'AI-powered image analysis for environmental monitoring.'
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the updated data to your backend
    console.log('Updated data:', formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      skills: 'Image Classification, Object Detection',
      availability: '40',
      companyName: 'Acme Inc.',
      industry: 'Technology',
      projectDescription: 'AI-powered image analysis for environmental monitoring.'
    })
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
            {!isEditing && (
                <Button variant="ghost" onClick={() => setIsEditing(true)} className="text-blue-400 hover:text-blue-300">
                <Edit className="w-4 h-4 mr-2" />
                Edit
                </Button>
            )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              {profilePicture ? (
                <AvatarImage src={profilePicture} alt="Profile" />
              ) : (
                <>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>
                    <UserCircle className="w-32 h-32 text-gray-400" />
                    </AvatarFallback>
                </>
              )}
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

          {!isEditing && (
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
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="bg-gray-700 text-white border-gray-600"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            {userType === 'labeler' ? (
              <>
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        className="bg-gray-700 text-white border-gray-600"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                    </div>
                    <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        className="bg-gray-700 text-white border-gray-600"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input
                    id="skills"
                    className="bg-gray-700 text-white border-gray-600"
                    value={formData.skills}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability (hours per week)</Label>
                  <Input
                    id="availability"
                    type="number"
                    className="bg-gray-700 text-white border-gray-600"
                    value={formData.availability}
                    onChange={handleInputChange}
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
                    className="bg-gray-700 text-white border-gray-600"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    className="bg-gray-700 text-white border-gray-600"
                    value={formData.industry}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="projectDescription">Typical Project Description</Label>
                  <Textarea
                    id="projectDescription"
                    className="bg-gray-700 text-white border-gray-600"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
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