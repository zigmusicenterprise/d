"use client"

import { Clock, MapPin, Monitor, Smartphone } from "lucide-react"

interface Activity {
  id: string
  type: "login" | "password_change" | "email_change" | "2fa_enabled" | "2fa_disabled"
  description: string
  timestamp: string
  device: string
  location: string
}

export function SecurityActivity() {
  // Mock data - em produção, isso viria do backend
  const activities: Activity[] = [
    {
      id: "1",
      type: "login",
      description: "Successful login",
      timestamp: new Date().toISOString(),
      device: "Windows - Chrome",
      location: "São Paulo, Brazil"
    },
    {
      id: "2",
      type: "email_change",
      description: "Email address updated",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      device: "Windows - Chrome",
      location: "São Paulo, Brazil"
    },
    {
      id: "3",
      type: "2fa_enabled",
      description: "Two-factor authentication enabled",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      device: "Windows - Chrome",
      location: "São Paulo, Brazil"
    }
  ]

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "login":
        return <Monitor className="w-4 h-4" />
      case "2fa_enabled":
      case "2fa_disabled":
        return <Smartphone className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "login":
        return "text-blue-500 bg-blue-500/20 border-blue-500/30"
      case "2fa_enabled":
        return "text-green-500 bg-green-500/20 border-green-500/30"
      case "2fa_disabled":
        return "text-red-500 bg-red-500/20 border-red-500/30"
      default:
        return "text-[#FF4532] bg-[#FF4532]/20 border-[#FF4532]/30"
    }
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return "Just now"
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-6">Recent Security Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium mb-1">{activity.description}</h4>
              <div className="flex flex-wrap gap-4 text-sm text-white/50">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(activity.timestamp)}
                </span>
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3" />
                  {activity.device}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {activity.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
