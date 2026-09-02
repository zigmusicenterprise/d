"use client"

import { Play, Heart, Music, Trash2, Download, Share2 } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"

interface FavoritesTabProps {
  onPlayTrack: (track: any) => void
  onArtistClick?: (artistName: string) => void
  onNavigateHome?: () => void
}

export function FavoritesTab({ onPlayTrack, onArtistClick, onNavigateHome }: FavoritesTabProps) {
  const { favoriteTracks, removeFavorite } = useFavorites()

  const calculateTotalDuration = () => {
    // Mock calculation - em produção, somar durações reais
    return `${favoriteTracks.length * 3}:${(favoriteTracks.length * 45) % 60}`
  }

  const calculateTotalSize = () => {
    // Mock calculation - em produção, calcular tamanho real
    return `${Math.round(favoriteTracks.length * 3.5)} MB`
  }

  const stats = {
    totalTracks: favoriteTracks.length,
    totalDuration: calculateTotalDuration(),
    totalSize: calculateTotalSize()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-[#FF4532] fill-[#FF4532]" />
            Favorite Tracks
          </h2>
          <p className="text-white/60">Your most loved music collection</p>
        </div>
        <button className="px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors flex items-center gap-2">
          <Play className="w-5 h-5 fill-white" />
          Play All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Music className="w-5 h-5 text-[#FF4532]" />
            <span className="text-white/60 text-sm">Total Tracks</span>
          </div>
          <p className="text-white text-2xl font-bold">{stats.totalTracks}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Play className="w-5 h-5 text-[#FF4532]" />
            <span className="text-white/60 text-sm">Total Duration</span>
          </div>
          <p className="text-white text-2xl font-bold">{stats.totalDuration}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-5 h-5 text-[#FF4532]" />
            <span className="text-white/60 text-sm">Total Size</span>
          </div>
          <p className="text-white text-2xl font-bold">{stats.totalSize}</p>
        </div>
      </div>

      {/* Tracks List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] gap-4 px-6 py-4 border-b border-white/10 text-white/50 text-sm font-medium">
          <div className="w-12">#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Added</div>
          <div>Duration</div>
          <div className="w-24"></div>
        </div>

        {/* Tracks */}
        <div>
          {favoriteTracks.map((track, index) => (
            <div
              key={track.id}
              className="grid grid-cols-[auto_1fr_1fr_1fr_auto_auto] gap-4 px-6 py-4 hover:bg-white/5 transition-colors group items-center"
            >
              {/* Number / Play Button */}
              <div className="w-12">
                <div className="group-hover:hidden text-white/40 text-sm">{index + 1}</div>
                <button
                  onClick={() => onPlayTrack({ id: track.id, title: track.title, artist: track.artist, cover: track.cover })}
                  className="hidden group-hover:block"
                >
                  <Play className="w-4 h-4 text-white fill-white" />
                </button>
              </div>

              {/* Title & Artist */}
              <div className="flex items-center gap-3 min-w-0">
                <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-white font-medium truncate group-hover:text-[#FF4532] transition-colors">{track.title}</h4>
                  <p 
                    className="text-white/50 text-sm truncate cursor-pointer hover:text-[#FF4532] hover:underline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onArtistClick?.(track.artist)
                    }}
                  >
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Album */}
              <div className="text-white/50 text-sm truncate">{track.album || "Unknown Album"}</div>

              {/* Added Date */}
              <div className="text-white/50 text-sm">{(track as any).addedAt ? new Date((track as any).addedAt).toLocaleDateString() : "Recently"}</div>

              {/* Duration */}
              <div className="text-white/50 text-sm">{track.duration || "3:45"}</div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity w-24">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFavorite(track.id)
                  }}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Heart className="w-4 h-4 text-[#FF4532] fill-[#FF4532]" />
                </button>
                <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                  <Share2 className="w-4 h-4 text-white/60 hover:text-white" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFavorite(track.id)
                  }}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-white/60 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State (if no favorites) */}
      {favoriteTracks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">No favorites yet</h3>
          <p className="text-white/50 text-center max-w-md mb-6">
            Start adding tracks to your favorites by clicking the heart icon on any song
          </p>
          <button 
            onClick={onNavigateHome}
            className="px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors"
          >
            Discover Music
          </button>
        </div>
      )}
    </div>
  )
}
