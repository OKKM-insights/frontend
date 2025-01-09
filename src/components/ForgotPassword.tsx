import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from 'lucide-react'
import { SuccessPopup } from './SuccessPopup'
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // send a request to your backend to send the verification code
    console.log('Sending verification code to:', email);
    setStep(2);
    setError('');
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // verify the code with backend
    if (code === '1234') {
      setStep(3);
      setError('');
    } else {
      setError('Invalid code. Please try again.');
    }
  }

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    // send the new password to your backend
    console.log('Resetting password for:', email);
    setError('');
    // Handle form submission logic here

    setShowSuccessPopup(true);
    setTimeout(() => {
        setShowSuccessPopup(false); // Hide the popup
        router.push("/login"); // Navigate to the login page
    }, 3000);
    // Redirect to login page or show success message
  }

  return (
    <div className="relative z-10 w-full max-w-lg p-8 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
            {step > 1 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)} className="mr-2 group">
                <ArrowLeft className="h-4 w-4 text-white group-hover:text-black" />
                </Button>
            )}
            <h1 className="text-2xl font-bold text-center text-white">Forgot Password</h1>
        </div>
        {step === 1 && <p className="text-sm text-gray-400 mb-4">Enter your email to receive a verification code</p>}
        {step === 2 && <p className="text-sm text-gray-400 mb-4">Enter the 4-digit code sent to your email</p>}
        {step === 3 && <p className="text-sm text-gray-400 mb-4">Enter your new password</p>}

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-3 flex flex-col">
            <Label htmlFor="email" className='text-white text-left'>Email</Label>
            <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Send Verification Code
            </Button>
        </form>
        )}
        {step === 2 && (
        <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div className="space-y-3 flex flex-col">
            <Label htmlFor="code" className='text-white text-left'>Verification Code</Label>
            <Input
                id="code"
                type="text"
                placeholder="1234"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                maxLength={4}
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Verify Code
            </Button>
        </form>
        )}
        {step === 3 && (
        <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-3 flex flex-col">
            <Label htmlFor="password" className='text-white text-left'>New Password</Label>
            <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
            </div>
            <div className="space-y-3 flex flex-col">
            <Label htmlFor="confirm-password" className='text-white text-left'>Confirm New Password</Label>
            <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
            />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            Reset Password
            </Button>
        </form>
        )}
        {showSuccessPopup ?
            <SuccessPopup message='Password Changed'/>
        : <></>}
    </div>
  )
}