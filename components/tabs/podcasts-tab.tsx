"use client"

import { Play, Mic2, Clock, Calendar, TrendingUp, Bookmark } from "lucide-react"

interface Podcast {
  id: string
  title: string
  host: string
  cover: string
  description: string
  episodes: number
  category: string
  duration?: string
  date?: string
}

interface PodcastsTabProps {
  onPlayTrack: (track: any) => void
}

export function PodcastsTab({ onPlayTrack }: PodcastsTabProps) {
  const featuredPodcasts: Podcast[] = [
    { id: "1", title: "Music Production Secrets", host: "Producer Mike", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300", description: "Learn from the pros", episodes: 45, category: "Music" },
    { id: "2", title: "Behind The Beat", host: "DJ Sarah", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300", description: "Stories from artists", episodes: 32, category: "Interviews" },
    { id: "3", title: "Electronic Music History", host: "Dr. Sound", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300", description: "Evolution of electronic music", episodes: 28, category: "Education" },
  ]

  const recentEpisodes = [
    { id: "1", title: "How to Master Your Tracks", host: "Producer Mike", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200", duration: "45:32", date: "2 days ago", category: "Music Production" },
    { id: "2", title: "Interview with Travis Scott", host: "DJ Sarah", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200", duration: "1:12:45", date: "3 days ago", category: "Interviews" },
    { id: "3", title: "The Rise of Phonk", host: "Dr. Sound", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200", duration: "38:20", date: "5 days ago", category: "History" },
    { id: "4", title: "Mixing Tips for Beginners", host: "Producer Mike", cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=200", duration: "52:15", date: "1 week ago", category: "Tutorial" },
  ]

  const categories = [
    { name: "Music Production", count: 156, color: "from-purple-500 to-pink-500" },
    { name: "Interviews", count: 89, color: "from-blue-500 to-cyan-500" },
    { name: "History", count: 67, color: "from-orange-500 to-red-500" },
    { name: "Tutorials", count: 124, color: "from-green-500 to-teal-500" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Mic2 className="w-8 h-8 text-[#FF4532]" />
          Podcasts
        </h2>
        <p className="text-white/60">Discover music podcasts and interviews</p>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Browse by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className="group relative h-24 rounded-2xl overflow-hidden transition-transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-lg">{category.name}</span>
                <span className="text-white/80 text-sm">{category.count} podcasts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Podcasts */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#FF4532]" />
          Featured Podcasts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPodcasts.map((podcast) => (
            <div key={podcast.id} className="group cursor-pointer">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl">
                <img src={podcast.cover} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onPlayTrack({ id: podcast.id, title: podcast.title, artist: podcast.host, cover: podcast.cover })}
                    className="w-16 h-16 rounded-full bg-[#FF4532] flex items-center justify-center shadow-xl"
                  >
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </button>
                </div>
                <div className="absolute top-3 right-3">
                  <button className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#FF4532] transition-colors">
                    <Bookmark className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <h4 className="text-white font-semibold truncate group-hover:text-[#FF4532] transition-colors">{podcast.title}</h4>
              <p className="text-white/50 text-sm truncate">{podcast.host}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/40 text-xs">{podcast.episodes} episodes</span>
                <span className="text-white/20">•</span>
                <span className="text-white/40 text-xs">{podcast.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Episodes */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF4532]" />
          Recent Episodes
        </h3>
        <div className="space-y-4">
          {recentEpisodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer group flex gap-4"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <img src={episode.cover} alt={episode.title} className="w-full h-full rounded-xl object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold mb-1 truncate group-hover:text-[#FF4532] transition-colors">{episode.title}</h4>
                    <p className="text-white/50 text-sm truncate">{episode.host}</p>
                  </div>
                  <button
                    onClick={() => onPlayTrack({ id: episode.id, title: episode.title, artist: episode.host, cover: episode.cover })}
                    className="w-10 h-10 rounded-full bg-[#FF4532] hover:bg-[#d44a42] flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {episode.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {episode.date}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-full">{episode.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
