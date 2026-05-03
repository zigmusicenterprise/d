"use client"

import { useEffect, useState } from "react"
import { Heart, Check, X, UserPlus, UserMinus } from "lucide-react"

interface ToastProps {
  message: string
  type: "favorite" | "unfavorite" | "follow" | "unfollow"
  show: boolean
  onClose: () => void
}

export function ToastNotification({ message, type, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const icons = {
    favorite: <Heart className="w-5 h-5 text-white fill-white" />,
    unfavorite: <X className="w-5 h-5 text-white" />,
    follow: <UserPlus className="w-5 h-5 text-white" />,
    unfollow: <UserMinus className="w-5 h-5 text-white" />
  }

  const colors = {
    favorite: "from-[#FF4532] to-[#FF6B5B]",
    unfavorite: "from-gray-600 to-gray-700",
    follow: "from-blue-500 to-blue-600",
    unfollow: "from-gray-600 to-gray-700"
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-5 duration-300">
      <div className={`bg-gradient-to-r ${colors[type]} rounded-full px-6 py-3 shadow-2xl flex items-center gap-3 border border-white/20`}>
        {icons[type]}
        <span className="text-white font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
