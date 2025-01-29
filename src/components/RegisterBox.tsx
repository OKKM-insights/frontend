import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from './ui/textarea'
import { useRouter } from 'next/navigation'
import { SuccessPopup } from './SuccessPopup'
import { Check, X } from 'lucide-react'
import axios from "axios"
import FailurePopup from './FailurePopup'

interface PasswordRequirement {
    label: string;
    regex: RegExp;
  }
  
  const passwordRequirements: PasswordRequirement[] = [
    { label: 'At least one letter', regex: /[a-zA-Z]/ },
    { label: 'At least one digit', regex: /\d/ },
    { label: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
    { label: 'Minimum 8 characters', regex: /.{8,}/ },
  ]

export default function RegisterBox() {
  const [loginType, setLoginType] = useState<'labeller' | 'client'>('labeller');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [dupEmail, setDupEmail] = useState("")
  const [wrongPassError, setWrongPassError] = useState("")
  const [password, setPassword] = useState('')
  const [requirements, setRequirements] = useState<boolean[]>(new Array(passwordRequirements.length).fill(false))
  const router = useRouter();
  useEffect(() => {
    const newRequirements = passwordRequirements.map(req => req.regex.test(password))
    setRequirements(newRequirements)
  }, [password])

  const handleFormSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    const formValues = Object.fromEntries(formData.entries())
    formValues["user_type"] = loginType

    console.log(formValues)

    if (String(formValues["password"]) !== String(formValues["confirm_password"])){
      setWrongPassError("Does not match Password")
      return
    } else{
      setWrongPassError("")
    }

    // send request to back end
    const url = 'http://localhost:5050/api/register'
    //const url = 'https://api.orbitwatch.xyz/api/register'
    axios.post(url, formValues, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => {
      if (response.status === 200) {
        setShowSuccessPopup(true);
        setTimeout(() => {
            setShowSuccessPopup(false);
            router.push("/login");
        }, 3000);
      } else {
        console.error("Failed to submit the form")
        setShowFailurePopup(true)
      }
    }).catch(err => {
      console.error(err)
      if (err.response.data.error.includes("Duplicate entry")){
        setDupEmail("Account with this email already exists")
      } else{
        setShowFailurePopup(true)
      }
    });
  };
  return (
    <div className="relative z-10 w-full max-w-lg p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-center text-white">Create Account</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
            <button
                className={`px-5 py-2 text-base ${loginType === 'labeller' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
                onClick={() => setLoginType('labeller')}
            >
                Labeller
            </button>
            <button
                className={`px-5 py-2 text-base ${loginType === 'client' ? 'border-b-2 border-blue-600 font-semibold' : ''} text-white`}
                onClick={() => setLoginType('client')}
            >
                Client
            </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="space-y-2">
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name='email' type="email" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" required/>
                {dupEmail && (
                  <p className="text-red-500 text-sm">{dupEmail}</p>)}
            </div>
            <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" value={password} onChange={(e) => setPassword(e.target.value)} name='password' type="password" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" required/>
            </div>
            <div className="space-y-2">
                <ul className="space-y-1">
                {passwordRequirements.map((req, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        {requirements[index] ? (
                            <Check className="w-4 h-4 text-green-500" />
                        ) : (
                            <X className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${requirements[index] ? 'text-green-500' : 'text-gray-400'}`}>
                            {req.label}
                        </span>
                    </li>
                ))}
                </ul>
            </div>
            <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" name='confirm_password' type="password" pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" required/>
                {wrongPassError && (
                  <p className="text-red-500 text-sm">{wrongPassError}</p>)}
            </div>
            {loginType === 'labeller' ? (
                <>
                    <div>
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" name='first_name' className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" required/>
                    </div>
                    <div>
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" name='last_name' className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" required/>
                    </div>
                    <div>
                        <Label htmlFor="skills">Skills</Label>
                        <Input id="skills" name='skills' className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" placeholder="e.g., Image Classification, Object Detection" />
                    </div>
                    <div>
                        <Label htmlFor="availability">Availability (hours per week)</Label>
                        <Input id="availability" name='availability' type="number" className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
                    </div>
                    <div  className="mt-6  text-center">
                        <Button type="submit" className="mt-4 w-3/4 bg-blue-600 hover:bg-blue-700 text-white ">
                            Register as Labeller
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input id="company-name" name='company_name' className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" required/>
                    </div>
                    <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input id="industry" name='industry' className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" required/>
                    </div>
                    <div>
                        <Label htmlFor="typical-proj">Typical Project Description</Label>
                        <Textarea id="typical-proj" name='typical_proj' className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500" />
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
        {showFailurePopup ?
            <FailurePopup open={showFailurePopup} onClose={() => setShowFailurePopup(false)} message='Something went wrong, please try again' />
        : <></>}
    </div>
  )
}