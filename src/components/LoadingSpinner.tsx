import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

export default function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" data-testid="loading-spinner">
      <div className={`animate-spin rounded-full border-t-4 border-white border-opacity-75 ${sizeClasses[size]}`}></div>
    </div>
  )
}