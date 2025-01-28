import React from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from 'lucide-react'

interface FailurePopupProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export default function FailurePopup({ open, onClose, message }: FailurePopupProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 p-6 rounded-lg max-w-sm mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Operation Failed</h2>
          <p className="text-gray-300 mb-4">{message}</p>
          <div className="bg-red-500 rounded-full p-3 mb-4">
            <X className="w-10 h-10 text-white" />
          </div>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}