"use client"

import { Play, Radio as RadioIcon, Users, Clock, Wifi } from "lucide-react"

interface RadioStation {
  id: string
  name: string
  description: string
  cover: string
  genre: string
  listeners: string
  isLive: boolean
  dj?: string
}

interface RadioTabProps {
  onPlayTrack: (track: any) => void
}

export function RadioTab({ onPlayTrack }: RadioTabProps) {
  const liveStations: RadioStation[] = [
    { id: "1", name: "ZIG PHONK Radio", description: "24/7 Phonk music", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300", genre: "Phonk", listeners: "12.5K", isLive: true, dj: "DJ Shadow" },
    { id: "2", name: "Trap Nation", description: "Best trap hits", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300", genre: "Trap", listeners: "8.3K", isLive: true, dj: "MC Beats" },
    { id: "3", name: "Techno Underground", description: "Deep techno vibes", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300", genre: "Techno", listeners: "15.2K", isLive: true, dj: "DJ Pulse" },
  ]

  const popularStations: RadioStation[] = [
    { id: "4", name: "Lo-Fi Beats", description: "Chill study music", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300", genre: "Lo-Fi", listeners: "25.1K", isLive: true },
    { id: "5", name: "Rock Classics", description: "Legendary rock hits", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300", genre: "Rock", listeners: "18.7K", isLive: true },
    { id: "6", name: "Pop Hits", description: "Today's top pop", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300", genre: "Pop", listeners: "32.4K", isLive: true },
    { id: "7", name: "Jazz Lounge", description: "Smooth jazz", cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300", genre: "Jazz", listeners: "9.8K", isLive: true },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RadioIcon className="w-8 h-8 text-[#FF4532]" />
          Radio Stations
        </h2>
        <p className="text-white/60">Listen to live radio stations 24/7</p>
      </div>

      {/* Live Now - Featured */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5 text-red-500 animate-pulse" />
          Live Now
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveStations.map((station) => (
            <div key={station.id} className="group cursor-pointer">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl">
                <img src={station.cover} alt={station.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                
                {/* Live Badge */}
                <div className="absolute top-3 left-3 bg-red-500 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full" />
                  <span className="text-white text-xs font-bold uppercase">Live</span>
                </div>

                {/* Listeners Count */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {station.listeners}
                  </span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => onPlayTrack({ id: station.id, title: station.name, artist: station.dj || "Live Radio", cover: station.cover })}
                    className="w-16 h-16 rounded-full bg-[#FF4532] flex items-center justify-center shadow-xl"
                  >
                    <Play className="w-7 h-7 text-white fill-white ml-1" />
                  </button>
                </div>

                {/* DJ Info */}
                {station.dj && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-white text-xs font-medium">Now Playing</p>
                    <p className="text-white/80 text-xs">{station.dj}</p>
                  </div>
                )}
              </div>
              <h4 className="text-white font-semibold truncate group-hover:text-[#FF4532] transition-colors">{station.name}</h4>
              <p className="text-white/50 text-sm truncate">{station.description}</p>
              <span className="text-white/40 text-xs">{station.genre}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Stations */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Popular Stations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularStations.map((station) => (
            <div
              key={station.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer group flex gap-4"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <img src={station.cover} alt={station.name} className="w-full h-full rounded-xl object-cover" />
                {station.isLive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0d0d0d] animate-pulse" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold mb-1 truncate group-hover:text-[#FF4532] transition-colors">{station.name}</h4>
                <p className="text-white/50 text-sm mb-2 truncate">{station.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {station.listeners} listening
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 rounded-full">{station.genre}</span>
                </div>
              </div>

              <button
                onClick={() => onPlayTrack({ id: station.id, title: station.name, artist: "Live Radio", cover: station.cover })}
                className="w-12 h-12 rounded-full bg-[#FF4532] hover:bg-[#d44a42] flex items-center justify-center transition-colors flex-shrink-0"
              >
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#FF4532]" />
          Today's Schedule
        </h3>
        <div className="space-y-3">
          {[
            { time: "14:00", show: "Afternoon Phonk Mix", dj: "DJ Shadow", station: "ZIG PHONK Radio" },
            { time: "16:00", show: "Trap Hour", dj: "MC Beats", station: "Trap Nation" },
            { time: "18:00", show: "Evening Techno", dj: "DJ Pulse", station: "Techno Underground" },
            { time: "20:00", show: "Night Vibes", dj: "DJ Luna", station: "ZIG PHONK Radio" },
          ].map((schedule, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="text-[#FF4532] font-bold text-lg w-16">{schedule.time}</div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{schedule.show}</h4>
                <p className="text-white/50 text-sm">{schedule.dj} • {schedule.station}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
