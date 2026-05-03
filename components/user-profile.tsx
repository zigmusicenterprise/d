"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, XCircle, Mail } from "lucide-react"

interface UserData {
  email: string
  username: string
  emailVerified?: boolean
  verifiedAt?: string
}

export function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Carregar dados do usuário do localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUserData(JSON.parse(storedUser))
    }
  }, [])

  if (!userData) {
    return null
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-white text-xl font-semibold mb-6">Profile Information</h3>
      
      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="text-white/50 text-sm block mb-1">Username</label>
          <p className="text-white font-medium">{userData.username}</p>
        </div>

        {/* Email with Verification Status */}
        <div>
          <label className="text-white/50 text-sm block mb-1">Email</label>
          <div className="flex items-center gap-3">
            <p className="text-white font-medium">{userData.email}</p>
            {userData.emailVerified ? (
              <div className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-green-500 text-xs font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-500 text-xs font-medium">Not Verified</span>
              </div>
            )}
          </div>
          {userData.emailVerified && userData.verifiedAt && (
            <p className="text-white/30 text-xs mt-1">
              Verified on {new Date(userData.verifiedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Verification Badge */}
        {userData.emailVerified && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Email Verified</h4>
                <p className="text-white/60 text-sm">
                  Your email has been successfully verified. You have full access to all features.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
