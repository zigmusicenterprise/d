"use client"

import { Play, Heart } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"

interface Track {
  id: string
  title: string
  artist: string
  cover: string
  previewUrl?: string
}

interface TrackCardProps {
  track: Track
  onPlay: () => void
  size?: "small" | "medium" | "large"
}

export function TrackCardWithFavorite({ track, onPlay, size = "medium" }: TrackCardProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const sizeClasses = {
    small: "w-[120px] h-[120px]",
    medium: "w-[153px] h-[153px]",
    large: "w-[200px] h-[200px]"
  }

  return (
    <div className="flex-shrink-0 group cursor-pointer" onClick={onPlay}>
      <div className={`relative ${sizeClasses[size]} rounded-[25px] overflow-hidden mb-2`}>
        <img
          src={track.cover}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#FF4532] flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (isFavorite(track.id)) {
              removeFavorite(track.id)
            } else {
              addFavorite(track)
            }
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all z-10 ${
            isFavorite(track.id)
              ? "bg-[#FF4532] scale-100"
              : "bg-black/60 hover:bg-[#FF4532] scale-90 hover:scale-100 opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart className={`w-4 h-4 transition-all ${
            isFavorite(track.id) ? "text-white fill-white" : "text-white"
          }`} />
        </button>
      </div>
      
      <h4 className={`text-white text-xs truncate ${sizeClasses[size]}`}>{track.title}</h4>
      <p className={`text-white/50 text-xs truncate ${sizeClasses[size]}`}>{track.artist}</p>
    </div>
  )
}
