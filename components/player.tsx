"use client"

import { useState } from "react"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Heart,
  ListMusic
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface PlayerProps {
  track?: {
    title: string
    artist: string
    coverImage: string
  }
}

export function Player({ track }: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(30)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off')

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentTime = (progress / 100) * 215
  const totalTime = 215

  if (!track) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#181818] border-t border-border h-[72px]">
      <div className="flex items-center justify-between h-full px-4">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-[240px] min-w-[180px]">
          <img
            src={track.coverImage}
            alt={track.title}
            className="w-14 h-14 object-cover rounded"
          />
          <div className="min-w-0">
            <h4 className="text-sm text-white font-medium truncate hover:underline cursor-pointer">
              {track.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate hover:text-white cursor-pointer">
              {track.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`flex-shrink-0 ${isLiked ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-primary' : ''}`} />
          </Button>
        </div>

        {/* Main Controls */}
        <div className="flex flex-col items-center flex-1 max-w-[600px] px-4">
          <div className="flex items-center gap-2 mb-1">
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 ${isShuffle ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
              onClick={() => setIsShuffle(!isShuffle)}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-white"
            >
              <SkipBack className="w-4 h-4" fill="currentColor" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 bg-white text-black hover:bg-white/90 hover:text-black rounded-full"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-white"
            >
              <SkipForward className="w-4 h-4" fill="currentColor" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-8 h-8 ${repeatMode !== 'off' ? 'text-primary' : 'text-muted-foreground hover:text-white'}`}
              onClick={() => setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')}
            >
              <Repeat className="w-4 h-4" />
              {repeatMode === 'one' && (
                <span className="absolute text-[8px] font-bold">1</span>
              )}
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <div className="flex-1">
              <Slider
                value={[progress]}
                onValueChange={(value) => setProgress(value[0])}
                max={100}
                step={0.1}
                className="cursor-pointer [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_.bg-primary]:bg-primary [&:hover_.bg-primary]:bg-primary"
              />
            </div>
            <span className="text-xs text-muted-foreground w-10">
              {formatTime(totalTime)}
            </span>
          </div>
        </div>

        {/* Volume & Extra Controls */}
        <div className="flex items-center gap-3 w-[180px] justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-white"
          >
            <ListMusic className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-white"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <div className="w-20">
              <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(value) => {
                  setVolume(value[0])
                  if (value[0] > 0) setIsMuted(false)
                }}
                max={100}
                step={1}
                className="cursor-pointer [&_[role=slider]]:bg-white [&_[role=slider]]:border-0 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
