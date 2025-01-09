import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import { SuccessPopup } from './SuccessPopup';

export default function RegisterBox() {
  const [loginType, setLoginType] = useState<'labeler' | 'client'>('labeler');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  return (
    <div className="relative z-10 w-full max-w-lg p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-white">Create Account</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
            <button
                className={`px-5 py-2 text-base ${loginType === 'labeler' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
                onClick={() => setLoginType('labeler')}
            >
                Labeler
            </button>
            <button
                className={`px-5 py-2 text-base ${loginType === 'client' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
                onClick={() => setLoginType('client')}
            >
                Client
            </button>
        </div>

        {/* Form Content */}
        <form onSubmit={(e) => {
            e.preventDefault()
            // Handle form submission logic here

            setShowSuccessPopup(true);
            setTimeout(() => {
                setShowSuccessPopup(false); // Hide the popup
                router.push("/login"); // Navigate to the login page
            }, 3000);
        }} className="space-y-2">
            <div>
                <Label htmlFor="labeler-email">Email</Label>
                <Input id="labeler-email" type="email" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
            </div>
            <div>
                <Label htmlFor="labeler-password">Password</Label>
                <Input id="labeler-password" type="password" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
            </div>
            <div>
                <Label htmlFor="labeler-confirm-password">Confirm Password</Label>
                <Input id="labeler-confirm-password" type="password" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
            </div>
            {loginType === 'labeler' ? (
                <>
                    <div>
                        <Label htmlFor="full-name">First Name</Label>
                        <Input id="full-name" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <Label htmlFor="full-name">Last Name</Label>
                        <Input id="full-name" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <Label htmlFor="skills">Skills</Label>
                        <Input id="skills" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" placeholder="e.g., Image Classification, Object Detection" />
                    </div>
                    <div>
                        <Label htmlFor="availability">Availability (hours per week)</Label>
                        <Input id="availability" type="number" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div  className="mt-6  text-center">
                        <Button type="submit" className="mt-4 w-3/4 bg-blue-600 hover:bg-blue-700 text-white ">
                            Register as Labeler
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <Label htmlFor="typical-proj">Typical Project Description</Label>
                        <Textarea id="typical-proj" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div  className="mt-6  text-center">
                        <Button type="submit" className="mt-4 w-3/4 bg-blue-600 hover:bg-blue-700 text-white ">
                            Register as Client
                        </Button>
                    </div>
                </>
            )}
        </form>

        <div className="mt-4 pt-3 text-center text-sm border-t border-gray-700">
            <p className="text-white">Already have an account? <span onClick={() => router.push("/login")} className="text-green-400 hover:text-green-500 cursor-pointer">Login</span></p>
        </div>
        {showSuccessPopup ?
            <SuccessPopup message='Registration Successful' />
        : <></>}
    </div>
  )
}