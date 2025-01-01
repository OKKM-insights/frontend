import { Dialog } from "@/components/ui/dialog"
import { CheckCircle } from 'lucide-react'

export function SuccessPopup() {
  return (
    <Dialog>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center max-w-sm mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Registration Successful</h2>
            <CheckCircle className="text-green-500 w-24 h-24 mb-6" />
          </div>
        </div>
    </Dialog>
  )
}