"use client"

import { useState } from "react"
import { Play, Heart, TrendingUp, Sparkles, Music2, Headphones, Check } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"

interface Track {
  id: string
  title: string
  artist: string
  cover: string
  genre?: string
  plays?: string
}

interface DiscoverTabProps {
  onPlayTrack: (track: any) => void
  onArtistClick?: (artistName: string) => void
}

export function DiscoverTab({ onPlayTrack, onArtistClick }: DiscoverTabProps) {
  const { addFavorite, removeFavorite, isFavorite, followArtist, unfollowArtist, isFollowing } = useFavorites()
  const genres = [
    { id: "phonk", name: "Phonk", color: "from-purple-500 to-pink-500" },
    { id: "trap", name: "Trap", color: "from-orange-500 to-red-500" },
    { id: "techno", name: "Techno", color: "from-blue-500 to-cyan-500" },
    { id: "lofi", name: "Lo-Fi", color: "from-green-500 to-teal-500" },
    { id: "rock", name: "Rock", color: "from-red-500 to-yellow-500" },
    { id: "pop", name: "Pop", color: "from-pink-500 to-purple-500" },
  ]

  const trendingTracks: Track[] = [
    { id: "1", title: "Midnight Drive", artist: "PHONK MASTER", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300", genre: "Phonk", plays: "2.5M" },
    { id: "2", title: "Bass Drop", artist: "DJ Trap King", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300", genre: "Trap", plays: "1.8M" },
    { id: "3", title: "Neon Lights", artist: "Techno Vibes", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300", genre: "Techno", plays: "3.2M" },
    { id: "4", title: "Chill Beats", artist: "Lo-Fi Dreams", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300", genre: "Lo-Fi", plays: "4.1M" },
  ]

  const newArtists = [
    { id: "1", name: "Nova Wave", followers: "125K", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200" },
    { id: "2", name: "Echo Sound", followers: "98K", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200" },
    { id: "3", name: "Beat Maker", followers: "156K", cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=200" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#FF4532]" />
          Discover New Music
        </h2>
        <p className="text-white/60">Explore trending tracks and emerging artists</p>
      </div>

      {/* Genres */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Browse by Genre</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre) => (
            <button
              key={genre.id}
              className="group relative h-32 rounded-2xl overflow-hidden transition-transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{genre.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Now */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#FF4532]" />
          Trending Now
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trendingTracks.map((track) => (
            <div key={track.id} className="group cursor-pointer">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl">
                <img src={track.cover} alt={track.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => onPlayTrack({ id: track.id, title: track.title, artist: track.artist, cover: track.cover })}
                    className="w-14 h-14 rounded-full bg-[#FF4532] flex items-center justify-center shadow-xl"
                  >
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isFavorite(track.id)) {
                        removeFavorite(track.id)
                      } else {
                        addFavorite(track)
                      }
                    }}
                    className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                      isFavorite(track.id)
                        ? "bg-[#FF4532] scale-100"
                        : "bg-black/60 hover:bg-[#FF4532] scale-90 hover:scale-100"
                    }`}
                  >
                    <Heart className={`w-5 h-5 transition-all ${
                      isFavorite(track.id) ? "text-white fill-white" : "text-white"
                    }`} />
                  </button>
                </div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                  <span className="text-white text-xs font-medium flex items-center gap-1">
                    <Headphones className="w-3 h-3" />
                    {track.plays}
                  </span>
                </div>
              </div>
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
              <span className="text-white/40 text-xs">{track.genre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Artists */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Music2 className="w-5 h-5 text-[#FF4532]" />
          Rising Artists
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newArtists.map((artist) => (
            <div key={artist.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <img src={artist.cover} alt={artist.name} className="w-20 h-20 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1 group-hover:text-[#FF4532] transition-colors">{artist.name}</h4>
                  <p className="text-white/50 text-sm">{artist.followers} followers</p>
                </div>
                <button
                  onClick={() => {
                    if (isFollowing(artist.id)) {
                      unfollowArtist(artist.id)
                    } else {
                      followArtist(artist)
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isFollowing(artist.id)
                      ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                      : "bg-[#FF4532] text-white hover:bg-[#d44a42]"
                  }`}
                >
                  {isFollowing(artist.id) ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Following
                    </span>
                  ) : (
                    "Follow"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
