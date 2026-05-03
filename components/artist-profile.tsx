"use client"

import { useState } from "react"
import { Play, Heart, Share2, Check, Music, Users, Calendar, X } from "lucide-react"
import { useFavorites } from "@/contexts/favorites-context"

interface Track {
  id: string
  title: string
  album: string
  duration: string
  plays: string
  cover: string
}

interface ArtistProfileProps {
  artistName: string
  onClose: () => void
  onPlayTrack: (track: any) => void
}

export function ArtistProfile({ artistName, onClose, onPlayTrack }: ArtistProfileProps) {
  const { followArtist, unfollowArtist, isFollowing, addFavorite, removeFavorite, isFavorite } = useFavorites()
  
  // Mock data - em produção, buscar da API
  const artistData = {
    id: artistName.toLowerCase().replace(/\s+/g, '-'),
    name: artistName,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
    banner: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200",
    followers: "2.5M",
    monthlyListeners: "5.8M",
    verified: true,
    bio: `${artistName} is a talented artist known for creating amazing music that resonates with millions of fans worldwide.`,
    genres: ["Pop", "Electronic", "Dance"],
  }

  const topTracks: Track[] = [
    { id: "1", title: "Hit Song #1", album: "Latest Album", duration: "3:45", plays: "125M", cover: artistData.cover },
    { id: "2", title: "Popular Track", album: "Greatest Hits", duration: "4:12", plays: "98M", cover: artistData.cover },
    { id: "3", title: "Fan Favorite", album: "Latest Album", duration: "3:28", plays: "87M", cover: artistData.cover },
    { id: "4", title: "Chart Topper", album: "Singles", duration: "3:55", plays: "76M", cover: artistData.cover },
    { id: "5", title: "New Release", album: "Latest Album", duration: "4:01", plays: "54M", cover: artistData.cover },
  ]

  const albums = [
    { id: "1", title: "Latest Album", year: "2024", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300" },
    { id: "2", title: "Greatest Hits", year: "2023", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300" },
    { id: "3", title: "Debut Album", year: "2022", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300" },
  ]

  const following = isFollowing(artistData.id)

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-50"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Banner */}
      <div className="relative h-[400px] w-full">
        <img src={artistData.banner} alt={artistData.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
        
        {/* Artist Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              {/* Artist Image */}
              <img
                src={artistData.cover}
                alt={artistData.name}
                className="w-48 h-48 rounded-full object-cover border-4 border-white/20 shadow-2xl"
              />
              
              {/* Info */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  {artistData.verified && (
                    <div className="bg-blue-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-white/80 text-sm font-medium">Verified Artist</span>
                </div>
                <h1 className="text-6xl font-bold text-white mb-4">{artistData.name}</h1>
                <div className="flex items-center gap-6 text-white/80">
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {artistData.followers} followers
                  </span>
                  <span>•</span>
                  <span>{artistData.monthlyListeners} monthly listeners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Actions */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => onPlayTrack({ id: topTracks[0].id, title: topTracks[0].title, artist: artistData.name, cover: topTracks[0].cover })}
            className="px-8 py-4 bg-[#FF4532] hover:bg-[#d44a42] rounded-full text-white font-semibold transition-colors flex items-center gap-3"
          >
            <Play className="w-6 h-6 fill-white" />
            Play
          </button>
          
          <button
            onClick={() => {
              if (following) {
                unfollowArtist(artistData.id)
              } else {
                followArtist({
                  id: artistData.id,
                  name: artistData.name,
                  followers: artistData.followers,
                  cover: artistData.cover
                })
              }
            }}
            className={`px-8 py-4 rounded-full font-semibold transition-all border-2 ${
              following
                ? "bg-transparent border-white/20 text-white hover:border-white/40"
                : "bg-transparent border-[#FF4532] text-[#FF4532] hover:bg-[#FF4532] hover:text-white"
            }`}
          >
            {following ? "Following" : "Follow"}
          </button>

          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* About */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">About</h2>
          <p className="text-white/70 leading-relaxed max-w-3xl">{artistData.bio}</p>
          <div className="flex gap-2 mt-4">
            {artistData.genres.map((genre) => (
              <span key={genre} className="px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm">
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Popular Tracks */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Popular</h2>
          <div className="space-y-2">
            {topTracks.map((track, index) => (
              <div
                key={track.id}
                className="group flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                onClick={() => onPlayTrack({ id: track.id, title: track.title, artist: artistData.name, cover: track.cover })}
              >
                {/* Number */}
                <div className="w-8 text-center">
                  <span className="text-white/40 group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 text-white hidden group-hover:block mx-auto" />
                </div>

                {/* Cover */}
                <img src={track.cover} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate group-hover:text-[#FF4532] transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-white/50 text-sm truncate">{track.plays} plays</p>
                </div>

                {/* Album */}
                <span className="text-white/50 text-sm hidden md:block w-48 truncate">{track.album}</span>

                {/* Favorite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (isFavorite(track.id)) {
                      removeFavorite(track.id)
                    } else {
                      addFavorite({ ...track, artist: artistData.name })
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className={`w-5 h-5 ${isFavorite(track.id) ? "text-[#FF4532] fill-[#FF4532]" : "text-white/60 hover:text-white"}`} />
                </button>

                {/* Duration */}
                <span className="text-white/40 text-sm w-12 text-right">{track.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Albums */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="group cursor-pointer">
                <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl">
                  <img src={album.cover} alt={album.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-14 h-14 rounded-full bg-[#FF4532] flex items-center justify-center shadow-xl">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </button>
                  </div>
                </div>
                <h4 className="text-white font-medium truncate group-hover:text-[#FF4532] transition-colors">{album.title}</h4>
                <p className="text-white/50 text-sm">{album.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
