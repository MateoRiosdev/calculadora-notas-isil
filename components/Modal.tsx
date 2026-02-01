'use client'

import { X, AlertTriangle, CheckCircle } from 'lucide-react'
import { ModalContent } from '@/types/calculator'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  content: ModalContent
  averageText?: string
}

export default function Modal({ isOpen, onClose, content, averageText }: ModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (content.type) {
      case 'error':
        return (
          <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        )
      case 'warning':
        return (
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-black" strokeWidth={2.5} />
          </div>
        )
      case 'success':
        return (
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          {content.title}
        </h2>
        {getIcon()}
        <p className="text-center text-black text-lg mb-2">
          {content.message}
        </p>
        {averageText && (
          <p className="text-center text-gray-600 text-sm mb-6 italic">
            {averageText}
          </p>
        )}
        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Regresar
        </button>
      </div>
    </div>
  )
}
