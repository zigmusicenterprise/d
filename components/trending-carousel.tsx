"use client"

import { Play } from "lucide-react"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const trendingPlaylists = [
  {
    id: "1",
    title: "Top 50 Brazil",
    description: "The most listened songs right now",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    tracks: 50,
  },
  {
    id: "2",
    title: "Lo-Fi Beats",
    description: "Para relaxar e focar",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop",
    tracks: 80,
  },
  {
    id: "3",
    title: "Trap Nacional",
    description: "O melhor do trap brasileiro",
    image: "https://images.unsplash.com/photo-1571609860754-01a8be3e04b1?w=400&h=400&fit=crop",
    tracks: 45,
  },
  {
    id: "4",
    title: "Indie Vibes",
    description: "Descobertas indie especiais",
    image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop",
    tracks: 60,
  },
  {
    id: "5",
    title: "Rock Clássico",
    description: "Os maiores clássicos do rock",
    image: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop",
    tracks: 100,
  },
  {
    id: "6",
    title: "Electronic",
    description: "Batidas eletrônicas para qualquer hora",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop",
    tracks: 75,
  },
]

export function TrendingCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 300
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Em Alta</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-white"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-white"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {trendingPlaylists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex-shrink-0 w-[180px] group cursor-pointer"
          >
            <div className="relative mb-3 overflow-hidden rounded">
              <img
                src={playlist.image}
                alt={playlist.title}
                className="w-full aspect-square object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                  <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors">
              {playlist.title}
            </h3>
            <p className="text-xs text-muted-foreground truncate">{playlist.description}</p>
            <p className="text-xs text-muted-foreground mt-1">{playlist.tracks} songs</p>
          </div>
        ))}
      </div>
    </div>
  )
}
