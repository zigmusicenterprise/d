"use client"

import { useState } from "react"
import { Play, Pause, Heart, MessageCircle, Share2, MoreHorizontal, Repeat } from "lucide-react"
import { Waveform } from "./waveform"
import { Button } from "@/components/ui/button"

interface Track {
  id: string
  title: string
  artist: string
  artistAvatar: string
  coverImage: string
  duration: string
  plays: string
  likes: string
  comments: string
  genre: string
  uploadedAt: string
}

interface TrackCardProps {
  track: Track
  isPlaying?: boolean
  onPlay?: () => void
}

export function TrackCard({ track, isPlaying = false, onPlay }: TrackCardProps) {
  const [progress, setProgress] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isReposted, setIsReposted] = useState(false)

  return (
    <div className="bg-card border border-border rounded-sm p-4 hover:bg-[#1f1f1f] transition-colors">
      <div className="flex gap-4">
        {/* Cover Image */}
        <div className="relative flex-shrink-0 group">
          <img
            src={track.coverImage}
            alt={track.title}
            className="w-[160px] h-[160px] object-cover rounded-sm"
          />
          <button
            onClick={onPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" fill="white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              )}
            </div>
          </button>
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
            {track.duration}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Artist Info */}
          <div className="flex items-center gap-2 mb-1">
            <img
              src={track.artistAvatar}
              alt={track.artist}
              className="w-5 h-5 rounded-full"
            />
            <span className="text-sm text-muted-foreground hover:text-white cursor-pointer truncate">
              {track.artist}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{track.uploadedAt}</span>
          </div>

          {/* Track Title */}
          <h3 className="text-white font-medium mb-2 hover:text-primary cursor-pointer truncate">
            {track.title}
          </h3>

          {/* Genre Tag */}
          <span className="inline-block text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-sm mb-3">
            #{track.genre}
          </span>

          {/* Waveform */}
          <div className="mb-3">
            <Waveform progress={progress} onProgressChange={setProgress} height={50} />
          </div>

          {/* Actions & Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 px-2 ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-primary' : ''}`} />
                <span className="text-xs">{track.likes}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 px-2 ${isReposted ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
                onClick={() => setIsReposted(!isReposted)}
              >
                <Repeat className={`w-4 h-4 mr-1`} />
                <span className="text-xs">Repost</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-white"
              >
                <Share2 className="w-4 h-4 mr-1" />
                <span className="text-xs">Compartilhar</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-muted-foreground hover:text-white"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">{track.comments}</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                {track.plays}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
