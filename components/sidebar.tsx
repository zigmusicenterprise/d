"use client"

import { TrendingUp, Users, Radio, Clock, ListMusic, Heart, History } from "lucide-react"
import Link from "next/link"

const trendingArtists = [
  { name: "DJ Shadow", followers: "1.2M", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "Flume", followers: "890K", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
  { name: "Disclosure", followers: "2.1M", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop" },
]

const genres = [
  { name: "Hip-Hop", count: "15M" },
  { name: "Electronic", count: "12M" },
  { name: "Rock", count: "8M" },
  { name: "Pop", count: "10M" },
  { name: "Lo-Fi", count: "5M" },
  { name: "Jazz", count: "3M" },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-[260px] flex-shrink-0 overflow-y-auto border-r border-border bg-sidebar">
      <div className="p-4">
        {/* Navigation */}
        <nav className="space-y-1 mb-6">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2 text-sm text-white bg-secondary rounded hover:bg-secondary/80 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            Discover
          </Link>
          <Link 
            href="/feed" 
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors"
          >
            <Users className="w-4 h-4" />
            Feed
          </Link>
          <Link 
            href="/stations" 
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors"
          >
            <Radio className="w-4 h-4" />
            Stations
          </Link>
        </nav>

        {/* Your Library */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Your Library
          </h3>
          <nav className="space-y-1">
            <Link 
              href="/library/history" 
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <Link 
              href="/library/likes" 
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors"
            >
              <Heart className="w-4 h-4" />
              Likes
            </Link>
            <Link 
              href="/library/playlists" 
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors"
            >
              <ListMusic className="w-4 h-4" />
              Playlists
            </Link>
            <Link 
              href="/library/listening-later" 
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors"
            >
              <Clock className="w-4 h-4" />
              Listen Later
            </Link>
          </nav>
        </div>

        {/* Genres */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
            Genres
          </h3>
          <div className="flex flex-wrap gap-2 px-3">
            {genres.map((genre) => (
              <button
                key={genre.name}
                className="text-xs bg-secondary text-muted-foreground hover:text-white hover:bg-secondary/80 px-2 py-1 rounded transition-colors"
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>

        {/* Trending Artists */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
            Trending Artists
          </h3>
          <div className="space-y-2">
            {trendingArtists.map((artist) => (
              <div
                key={artist.name}
                className="flex items-center gap-3 px-3 py-2 hover:bg-secondary rounded cursor-pointer transition-colors"
              >
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-white font-medium">{artist.name}</p>
                  <p className="text-xs text-muted-foreground">{artist.followers} followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
