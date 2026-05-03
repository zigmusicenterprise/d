"use client"

import { useState } from "react"
import { Heart, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { AuthModal } from "@/components/auth-modal"

const newReleases = [
  {
    id: 1,
    title: "PHONK by ZIG",
    artist: "ZIG Curated",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    title: "SUBMUNDO by ZIG",
    artist: "ZIG Curated",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    title: "TRAP by ZIG",
    artist: "ZIG Curated",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Everything's black",
    artist: "Ameed",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
  },
  {
    id: 5,
    title: "ZIG is Travis Scott",
    artist: "ZIG Curated",
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Hard Techno by ZIG",
    artist: "ZIG Curated",
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
  },
]

const topCharts = [
  {
    id: 1,
    title: "PHONK by ZIG",
    artist: "ZIG Curated",
    duration: "2:15:30",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    title: "SUBMUNDO by ZIG",
    artist: "ZIG Curated",
    duration: "1:45:20",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    title: "TRAP by ZIG",
    artist: "ZIG Curated",
    duration: "3:10:45",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop",
  },
]

export default function LandingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black">
      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full px-[5%] py-6 flex justify-end items-center gap-10 z-50">
        <div className="mr-auto">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/Logo.png" 
              alt="ZIG" 
              className="h-8 w-auto"
              style={{ objectFit: 'contain' }}
            />
            <span className="text-white font-bold text-xl tracking-wide">ZIG</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          <Link href="#discover" className="text-white/80 hover:text-white text-sm transition-all">
            Discover
          </Link>
          <Link href="#playlists" className="text-white/80 hover:text-white text-sm transition-all">
            Playlists
          </Link>
          <Link href="#library" className="text-white/80 hover:text-white text-sm transition-all">
            Library
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-white/5 border border-white/10 backdrop-blur-xl text-white hover:bg-white hover:text-black rounded-full px-6 h-10 text-sm font-medium transition-all duration-300"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(/Background.png)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50" />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="absolute left-[10%] md:left-[30%] top-[38%] w-[80%] md:w-[25vw] z-10 text-left animate-fadeInUp">
          <h1 className="text-[8vw] md:text-[3.3vw] leading-[1.1] mb-8 font-light tracking-tight text-white">
            No <span className="font-semibold">limits.</span><br />
            No <span className="font-semibold">ads.</span><br />
            Just <span className="font-semibold">music.</span>
          </h1>

          <Button 
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-[#FF4532] to-[#FF867E] text-white hover:scale-105 hover:shadow-[0_25px_50px_rgba(255,69,50,0.5)] rounded-xl px-6 h-12 text-sm font-medium transition-all duration-300 group flex items-center gap-3"
          >
            Start Listening Now
            <div className="bg-white rounded-lg w-8 h-8 flex items-center justify-center group-hover:w-full transition-all duration-300">
              <ArrowRight className="w-4 h-4 text-[#FF4532]" />
            </div>
          </Button>
        </div>

        {/* Hero Description */}
        <div className="absolute right-[5%] bottom-[10%] w-[90%] md:w-[16vw] text-left md:text-left z-10 animate-fadeInRight">
          <p className="text-[4vw] md:text-[1.1vw] font-light leading-relaxed text-white/80">
            The first <span className="font-semibold">100% free</span> app to listen to music in real-time with your friends.
          </p>
        </div>
      </section>

      {/* Discover Section */}
      <section id="discover" className="bg-black py-32 px-[5%]">
        <div className="max-w-[1600px] mx-auto">
          {/* Featured Card + Top Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-12 mb-20">
            {/* Featured Card */}
            <div className="relative h-[450px] bg-gradient-to-r from-[#FF4532] to-[#FF867E] rounded-[40px] p-16 overflow-hidden flex items-center">
              <div className="relative z-10 max-w-[50%]">
                <span className="text-black/70 text-sm mb-8 block">Curated playlist</span>
                <h2 className="text-[5rem] font-bold text-black leading-none mb-6">20'S HITS</h2>
                <p className="text-black/90 text-lg leading-relaxed mb-12">
                  All mine, Lie again, Petty call me everyday, Out of time, No love, Bad habit, and so much more
                </p>
                <div className="flex items-center gap-5">
                  <div className="flex -space-x-2">
                    <div className="w-9 h-9 rounded-full border-2 border-[#FF4532] bg-neutral-500 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50&h=50&fit=crop" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-[#FF4532] bg-neutral-500 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-9 h-9 rounded-full border-2 border-[#FF4532] bg-neutral-500 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&h=50&fit=crop" alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className="text-black font-medium">❤️ 33k Likes</span>
                </div>
              </div>
            </div>

            {/* Top Charts */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-8">Top charts</h3>
              <div className="flex flex-col gap-4">
                {topCharts.map((track, index) => (
                  <div
                    key={track.id}
                    className="relative bg-gradient-to-r from-white/[0.05] to-white/[0.02] backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 hover:border-[#FF4532]/30 hover:shadow-[0_8px_32px_rgba(255,69,50,0.15)] transition-all duration-300 cursor-pointer group"
                  >
                    {/* Ranking Number */}
                    <div className="w-8 text-center">
                      <span className={`text-2xl font-bold ${index === 0 ? 'text-[#FF4532]' : 'text-white/30'}`}>
                        {index + 1}
                      </span>
                    </div>
                    
                    {/* Cover with Play Button */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-14 h-14 rounded-xl object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-base mb-0.5 truncate group-hover:text-[#FF4532] transition-colors">{track.title}</h4>
                      <span className="text-white/50 text-sm truncate block">{track.artist}</span>
                    </div>
                    
                    <time className="text-white/30 text-sm font-mono hidden md:block">{track.duration}</time>
                    
                    <button className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-[#FF4532] hover:border-[#FF4532] hover:text-white transition-all duration-300">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Releases */}
          <div>
            <h3 className="text-2xl font-semibold text-white mb-8">New releases.</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {newReleases.map((track) => (
                <div key={track.id} className="group cursor-pointer">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl">
                    {/* Image */}
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    
                    {/* Glassmorphism Border */}
                    <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-[#FF4532]/40 transition-all duration-300" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#FF4532] flex items-center justify-center shadow-xl shadow-[#FF4532]/40 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      </div>
                    </div>
                    
                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#FF4532] transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <span className="text-white/80 text-xs font-medium bg-white/20 backdrop-blur-md px-2 py-1 rounded-full">
                          ZIG
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text Info */}
                  <div className="space-y-1">
                    <h3 className="text-white text-sm font-semibold truncate group-hover:text-[#FF4532] transition-colors duration-300">{track.title}</h3>
                    <p className="text-white/50 text-xs truncate">{track.artist}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center bg-black">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Thanks for listening. Now join us.
        </h2>
        <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
          Save tracks, follow artists, and create playlists. All free.
        </p>
        <Button 
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-gradient-to-r from-[#FF4532] to-[#FF867E] text-white hover:scale-105 hover:shadow-[0_25px_50px_rgba(255,69,50,0.5)] rounded-full px-10 h-12 text-sm font-semibold transition-all duration-300"
        >
          Create Account
        </Button>
        <p className="text-white/50 text-sm mt-6">
          Already have an account?{" "}
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="text-white hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
