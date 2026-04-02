"use client"

import { useState, useEffect, useRef } from "react"
import { 
  Home, 
  Library, 
  Radio, 
  User, 
  LogOut, 
  Search, 
  Heart, 
  Play, 
  Pause,
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat,
  Volume2,
  Settings,
  Compass,
  Mic2,
  Loader2,
  X,
  Music,
  Repeat1,
  ListPlus,
  Globe,
  Lock
} from "lucide-react"
import Link from "next/link"
import { useNewReleases, useTopTracks } from "@/hooks/use-spotify"
import { usePlayer } from "@/contexts/player-context"
import { useFavorites } from "@/contexts/favorites-context"
import { UserProfile } from "@/components/user-profile"
import { SettingsPanel } from "@/components/settings-panel"
import { ArtistProfile } from "@/components/artist-profile"
import { DiscoverTab } from "@/components/tabs/discover-tab"
import { PlaylistsTab } from "@/components/tabs/playlists-tab"
import { RadioTab } from "@/components/tabs/radio-tab"
import { PodcastsTab } from "@/components/tabs/podcasts-tab"
import { FavoritesTab } from "@/components/tabs/favorites-tab"

// Dados fallback caso a API não esteja configurada
const fallbackNewReleases = [
  { id: "1", title: "Blind", artist: "Wiz zee", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop" },
  { id: "2", title: "PHONK by ZIG", artist: "The van", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop" },
  { id: "3", title: "SUBMUNDO by ZIG", artist: "Krisx", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop" },
  { id: "4", title: "TRAP by ZIG", artist: "John Dillion", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop" },
  { id: "5", title: "Everything's black", artist: "Ameed", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop" },
  { id: "6", title: "ZIG is Travis Scott", artist: "Enimen", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop" },
  { id: "7", title: "Hard Techno by ZIG", artist: "Makrol eli", cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop" },
]

const fallbackTopCharts = [
  { id: "1", title: "dc playlist", artist: "Sean swadder", duration: "2:34", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { id: "2", title: "trap its real", artist: "Dj YK mule", duration: "1:02", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop" },
  { id: "3", title: "y2k never become", artist: "Obi Datti", duration: "2:01", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
]

// Cores para o banner carousel
const bannerColors = [
  'from-[#609eaf]/80',
  'from-[#9b59b6]/80',
  'from-[#e74c3c]/80',
  'from-[#2ecc71]/80',
  'from-[#f39c12]/80',
  'from-[#1abc9c]/80',
  'from-[#3498db]/80',
  'from-[#e91e63]/80',
]

export default function DashboardPage() {
  const player = usePlayer()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const [activeNav, setActiveNav] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showArtistProfile, setShowArtistProfile] = useState(false)
  const [selectedArtist, setSelectedArtist] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false)
  
  // Banner carousel state
  const [bannerIndex, setBannerIndex] = useState(0)
  const [featuredTracks, setFeaturedTracks] = useState<any[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Hooks do Spotify
  const { data: spotifyReleases, loading: loadingReleases } = useNewReleases(10)
  const { data: spotifyTopTracks, loading: loadingTopTracks } = useTopTracks(5)

  // Buscar músicas para o banner
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/spotify?type=search&q=top+hits+2024+2025&limit=8', { cache: 'no-store' })
        const json = await res.json()
        if (json.data && json.data.length > 0) {
          setFeaturedTracks(json.data)
        }
      } catch (err) {
        console.error('Failed to fetch featured:', err)
      } finally {
        setLoadingFeatured(false)
      }
    }
    fetchFeatured()
  }, [])

  // Auto-rotate banner
  useEffect(() => {
    if (featuredTracks.length === 0) return
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % featuredTracks.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [featuredTracks.length])
  
  // Estado de busca direto
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Busca direta quando debouncedQuery muda
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length === 0) {
      setSearchResults([])
      return
    }

    async function doSearch() {
      setLoadingSearch(true)
      setSearchError(null)
      try {
        const url = `/api/spotify?type=search&q=${encodeURIComponent(debouncedQuery.trim())}&limit=20`
        console.log('🔍 Fetching URL:', url)
        console.log('🔍 Query:', debouncedQuery, '| Encoded:', encodeURIComponent(debouncedQuery.trim()))
        const res = await fetch(url, { cache: 'no-store' })
        const json = await res.json()
        console.log('✅ Search API response:', json)
        console.log('✅ Data length:', json.data?.length)
        if (json.data && json.data.length > 0) {
          setSearchResults(json.data)
        } else {
          setSearchResults([])
          setSearchError(json.error || 'No results')
        }
      } catch (err) {
        console.error('❌ Search error:', err)
        setSearchError(err instanceof Error ? err.message : 'Error')
        setSearchResults([])
      } finally {
        setLoadingSearch(false)
      }
    }

    doSearch()
  }, [debouncedQuery])

  // Debug
  console.log('Search Debug:', { searchQuery, debouncedQuery, searchResults, loadingSearch, searchError, isSearchFocused })

  // Usar dados do Spotify ou fallback
  const newReleases = spotifyReleases || fallbackNewReleases
  const topCharts = spotifyTopTracks || fallbackTopCharts
  const popularTracks = searchResults && searchQuery ? searchResults : spotifyReleases || fallbackNewReleases

  return (
    <div className="h-screen w-screen bg-black overflow-hidden fixed inset-0">
      {/* Logo */}
      <Link href="/" className="absolute left-4 top-5 z-50 w-[72px] flex items-center justify-center">
        <img 
          src="/Logo.png" 
          alt="ZIG Music" 
          className="w-10 h-auto object-contain"
        />
      </Link>

      {/* Left Sidebar */}
      <div className="absolute left-4 top-20 bottom-[100px] w-[72px] flex flex-col gap-3">
        {/* Main Navigation */}
        <nav className="bg-transparent rounded-2xl p-3 flex flex-col items-center gap-2 flex-1 border border-white/10">
          {/* Nav Items */}
          {[
            { id: "home", icon: Home, label: "Home" },
            { id: "discover", icon: Compass, label: "Discover" },
            { id: "playlist", icon: Library, label: "Playlists" },
            { id: "radio", icon: Radio, label: "Radio" },
            { id: "podcasts", icon: Mic2, label: "Podcasts" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className="group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer"
            >
              {/* Active Background */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                activeNav === item.id 
                  ? "bg-gradient-to-br from-[#FF4532] to-[#FF6B5B] shadow-[0_4px_20px_rgba(255,69,50,0.4)]" 
                  : "bg-transparent group-hover:bg-white/5"
              }`} />
              
              {/* Icon */}
              <item.icon className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                activeNav === item.id 
                  ? "text-white" 
                  : "text-white/40 group-hover:text-white/70"
              }`} />
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1e1f] border border-white/10 rounded-lg text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1a1e1f] border-l border-b border-white/10 rotate-45" />
              </div>
            </button>
          ))}
          
          {/* Divider */}
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
          
          {/* Favorites */}
          <button 
            onClick={() => setActiveNav("favorites")}
            className="group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer"
          >
            {/* Active Background */}
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              activeNav === "favorites" 
                ? "bg-gradient-to-br from-[#FF4532] to-[#FF6B5B] shadow-[0_4px_20px_rgba(255,69,50,0.4)]" 
                : "bg-transparent group-hover:bg-white/5"
            }`} />
            
            <Heart className={`w-5 h-5 relative z-10 transition-colors ${
              activeNav === "favorites"
                ? "text-white fill-white"
                : "text-white/40 group-hover:text-[#FF4532]"
            }`} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1e1f] border border-white/10 rounded-lg text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50">
              Favorites
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1a1e1f] border-l border-b border-white/10 rotate-45" />
            </div>
          </button>
        </nav>

        {/* User Section */}
        <nav className="bg-transparent rounded-2xl p-3 flex flex-col items-center gap-2 border border-white/10">
          {/* Profile */}
          {/* Settings */}
          <button 
            onClick={() => {
              setShowSettings(!showSettings)
              setShowProfile(false)
              setActiveNav("settings")
            }}
            className={`group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 cursor-pointer ${
              activeNav === "settings"
                ? "bg-gradient-to-br from-[#FF4532] to-[#FF6B5B] shadow-[0_4px_20px_rgba(255,69,50,0.4)]"
                : "hover:bg-white/5"
            }`}
          >
            <Settings className={`w-5 h-5 transition-all duration-500 ${
              activeNav === "settings"
                ? "text-white rotate-90"
                : "text-white/40 group-hover:text-white/70 group-hover:rotate-90"
            }`} />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1e1f] border border-white/10 rounded-lg text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50">
              Settings
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1a1e1f] border-l border-b border-white/10 rotate-45" />
            </div>
          </button>
          
          {/* Logout */}
          <button 
            onClick={() => {
              localStorage.removeItem("user")
              window.location.href = "/"
            }}
            className="group relative w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="w-5 h-5 text-white/40 group-hover:text-red-500 transition-colors" />
            <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#1a1e1f] border border-white/10 rounded-lg text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl z-50">
              Logout
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-[#1a1e1f] border-l border-b border-white/10 rotate-45" />
            </div>
          </button>
        </nav>
      </div>

      {/* Top Search Bar */}
      <div className="absolute left-28 top-5 right-5 z-50" ref={searchRef}>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 z-10" />
          <input
            type="text"
            placeholder="Search songs, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50 focus:bg-white/10 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(""); setDebouncedQuery(""); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            >
              {loadingSearch ? (
                <Loader2 className="w-4 h-4 text-[#FF4532] animate-spin" />
              ) : (
                <X className="w-3 h-3 text-white/60" />
              )}
            </button>
          )}

          {/* Search Results Dropdown */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl max-h-[70vh] overflow-y-auto scrollbar-hide z-[100]">
              {loadingSearch ? (
                <div className="p-8 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#FF4532] animate-spin" />
                  <span className="text-white/50 text-sm">Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {/* Results Header */}
                  <div className="px-4 py-3 bg-white/5">
                    <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                    </span>
                  </div>
                  
                  {/* Results List */}
                  {searchResults.map((track: any) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 transition-all cursor-pointer group"
                      onClick={() => {
                        player.playTrack({
                          id: track.id,
                          title: track.title,
                          artist: track.artist,
                          cover: track.cover,
                          previewUrl: track.previewUrl,
                        })
                        setIsSearchFocused(false)
                      }}
                    >
                      {/* Cover */}
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
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate group-hover:text-[#FF4532] transition-colors">
                          {track.title}
                        </h4>
                        <p className="text-white/50 text-sm truncate">{track.artist}</p>
                      </div>
                      
                      {/* Duration */}
                      {track.duration && (
                        <span className="text-white/30 text-sm font-mono">{track.duration}</span>
                      )}
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF4532] transition-colors cursor-pointer"
                        >
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            player.addToQueue({
                              id: track.id,
                              title: track.title,
                              artist: track.artist,
                              cover: track.cover,
                              previewUrl: track.previewUrl,
                            })
                          }}
                          className="w-8 h-8 rounded-full bg-[#FF4532] flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center gap-3">
                  <Music className="w-12 h-12 text-white/20" />
                  <span className="text-white/50 text-sm">
                    {debouncedQuery ? 'No results found' : 'Type to search...'}
                  </span>
                  {debouncedQuery && <span className="text-white/30 text-xs">Try searching for another term</span>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="absolute left-28 right-0 top-[73px] bottom-[100px] overflow-y-auto overflow-x-hidden px-8 py-6 scrollbar-hide">
        {showArtistProfile ? (
          <ArtistProfile
            artistName={selectedArtist}
            onClose={() => {
              setShowArtistProfile(false)
              setSelectedArtist("")
            }}
            onPlayTrack={player.playTrack}
          />
        ) : showProfile ? (
          /* Profile View */
          <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">My Profile</h2>
              <button
                onClick={() => {
                  setShowProfile(false)
                  setActiveNav("home")
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <UserProfile />
          </div>
        ) : showSettings ? (
          /* Settings View */
          <div className="py-8">
            <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold text-white">Settings</h2>
              </div>
              <button
                onClick={() => {
                  setShowSettings(false)
                  setActiveNav("home")
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <SettingsPanel />
          </div>
        ) : activeNav === "discover" ? (
          <DiscoverTab 
            onPlayTrack={player.playTrack}
            onArtistClick={(artistName) => {
              setSelectedArtist(artistName)
              setShowArtistProfile(true)
            }}
          />
        ) : activeNav === "playlist" ? (
          <PlaylistsTab onPlayTrack={player.playTrack} />
        ) : activeNav === "radio" ? (
          <RadioTab onPlayTrack={player.playTrack} />
        ) : activeNav === "podcasts" ? (
          <PodcastsTab onPlayTrack={player.playTrack} />
        ) : activeNav === "favorites" ? (
          <FavoritesTab 
            onPlayTrack={player.playTrack}
            onArtistClick={(artistName) => {
              setSelectedArtist(artistName)
              setShowArtistProfile(true)
            }}
            onNavigateHome={() => setActiveNav("home")}
          />
        ) : (
          <div className="relative min-h-[1000px]">
          {/* Glow effect */}
          <div className="absolute left-[89px] top-[95px] w-1/2 h-[287px] bg-[#7a9096] opacity-45 blur-[26px] mix-blend-color-dodge" />

          {/* Featured Card + Top Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-8">
            {/* Featured Card - Carousel */}
            <div className="relative h-[373px] rounded-[40px] overflow-hidden">
              {loadingFeatured ? (
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
              ) : featuredTracks.length > 0 ? (
                <>
                  {/* Background Image with transition */}
                  <div className="absolute inset-0 transition-opacity duration-700">
                    <img 
                      src={featuredTracks[bannerIndex]?.cover || ''} 
                      alt={featuredTracks[bannerIndex]?.title}
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${bannerColors[bannerIndex % bannerColors.length]} to-transparent transition-all duration-700`} />
                  
                  {/* Album Art */}
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700">
                    <img 
                      src={featuredTracks[bannerIndex]?.cover || ''} 
                      alt={featuredTracks[bannerIndex]?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <button 
                      onClick={() => {
                        const track = featuredTracks[bannerIndex]
                        if (track) {
                          player.playTrack({
                            id: track.id,
                            title: track.title,
                            artist: track.artist,
                            cover: track.cover,
                            duration: track.duration,
                            previewUrl: track.previewUrl,
                          })
                        }
                      }}
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-full bg-[#FF4532] flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </button>
                  </div>
                  
                  <div className="relative z-10 p-12 h-full flex flex-col justify-between max-w-[60%]">
                    <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Featured</span>
                    
                    <div>
                      <h2 className="text-[32px] font-bold text-white mb-2 line-clamp-2 drop-shadow-lg">
                        {featuredTracks[bannerIndex]?.title}
                      </h2>
                      <p className="text-white/90 text-lg font-medium drop-shadow-md">
                        {featuredTracks[bannerIndex]?.artist}
                      </p>
                      {featuredTracks[bannerIndex]?.duration && (
                        <p className="text-white/60 text-sm mt-2">
                          Duration: {featuredTracks[bannerIndex]?.duration}
                        </p>
                      )}
                    </div>

                    {/* Carousel Indicators */}
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {featuredTracks.slice(0, 8).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setBannerIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              i === bannerIndex 
                                ? 'w-8 bg-white' 
                                : 'w-1.5 bg-white/40 hover:bg-white/60'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/50 text-xs">
                        {bannerIndex + 1} / {Math.min(featuredTracks.length, 8)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <span className="text-white/50">Loading...</span>
                </div>
              )}
            </div>

            {/* Top Charts */}
            <div>
              <h3 className="text-2xl font-bold text-[#efeee0] mb-6">Top charts</h3>
              <div className="flex flex-col gap-4">
                {loadingTopTracks ? (
                  // Loading skeleton
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="relative bg-white/[0.05] rounded-[20px] p-4 flex items-center gap-4 animate-pulse">
                      <div className="w-[63px] h-[63px] rounded-[10px] bg-white/10" />
                      <div className="flex-1">
                        <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  topCharts.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => player.playTrack({
                        id: track.id,
                        title: track.title,
                        artist: track.artist,
                        cover: track.cover,
                        previewUrl: (track as any).previewUrl,
                      })}
                      className="relative bg-white/[0.07] backdrop-blur-[9px] border border-white/30 rounded-[20px] p-4 flex items-center gap-4 hover:bg-white/[0.12] transition-all cursor-pointer group"
                    >
                      <div className="relative">
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-[63px] h-[63px] rounded-[10px] object-cover flex-shrink-0"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-[17px] mb-1 truncate">{track.title}</h4>
                        <span className="text-white/50 text-xs truncate block">{track.artist}</span>
                      </div>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#FF4532] hover:border-[#FF4532] transition-all cursor-pointer"
                      >
                        <Heart className="w-[18px] h-[18px]" />
                      </button>
                      <span className="text-white/50 text-sm hidden md:block">{track.duration}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* New Releases */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#efeee0] mb-6">
              {searchQuery ? `Resultados para "${searchQuery}"` : "New releases."}
            </h3>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
              {loadingReleases ? (
                // Loading skeleton
                [...Array(7)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 animate-pulse">
                    <div className="w-[153px] h-[153px] rounded-[25px] bg-white/10 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-3/4 mb-1" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                ))
              ) : (
                newReleases.map((track) => (
                  <div 
                    key={track.id} 
                    className="flex-shrink-0 group cursor-pointer"
                    onClick={() => player.playTrack({
                      id: track.id,
                      title: track.title,
                      artist: track.artist,
                      cover: track.cover,
                      previewUrl: (track as any).previewUrl,
                    })}
                  >
                    <div className="relative w-[153px] h-[153px] rounded-[25px] overflow-hidden mb-2">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#FF4532] flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-white text-xs truncate w-[153px]">{track.title}</h4>
                    <p className="text-white/50 text-xs truncate w-[153px]">{track.artist}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular in your area */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#efeee0] mb-6">Popular in your area</h3>
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
              {loadingReleases ? (
                // Loading skeleton
                [...Array(7)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 animate-pulse">
                    <div className="w-[153px] h-[153px] rounded-[25px] bg-white/10 mb-2" />
                    <div className="h-3 bg-white/10 rounded w-3/4 mb-1" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                ))
              ) : (
                popularTracks.map((track) => (
                  <div 
                    key={track.id} 
                    className="flex-shrink-0 group cursor-pointer"
                    onClick={() => player.playTrack({
                      id: track.id,
                      title: track.title,
                      artist: track.artist,
                      cover: track.cover,
                      previewUrl: (track as any).previewUrl,
                    })}
                  >
                    <div className="relative w-[153px] h-[153px] rounded-[25px] overflow-hidden mb-2">
                      <img
                        src={track.cover}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#FF4532] flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-white text-xs truncate w-[153px]">{track.title}</h4>
                    <p className="text-white/50 text-xs truncate w-[153px]">{track.artist}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Music Player */}
      <div className="absolute bottom-4 left-4 right-4 z-50">
        <div className="ml-[72px] h-[80px] bg-transparent backdrop-blur-xl border border-white/10 rounded-2xl flex items-center px-6 gap-6">
          {/* Current Track */}
          <div className="flex items-center gap-4 w-[250px]">
            <div className="relative group flex-shrink-0">
              {player.currentTrack?.cover ? (
                <img 
                  src={player.currentTrack.cover}
                  alt={player.currentTrack.title}
                  className="w-14 h-14 rounded-xl object-cover border border-white/10"
                  loading="eager"
                  style={{ imageRendering: 'crisp-edges' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 flex items-center justify-center">
                  <Music className="w-6 h-6 text-white/30" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-white text-sm font-medium truncate">
                {player.currentTrack?.title || "Selecione uma música"}
              </h4>
              <p className="text-white/50 text-xs truncate">
                {player.currentTrack?.artist || "---"}
              </p>
            </div>
            {player.currentTrack && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (isFavorite(player.currentTrack.id)) {
                      removeFavorite(player.currentTrack.id)
                    } else {
                      addFavorite(player.currentTrack)
                    }
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all"
                >
                  <Heart className={`w-4 h-4 ${isFavorite(player.currentTrack.id) ? 'fill-[#FF4532] text-[#FF4532]' : 'text-white/40 hover:text-white'}`} />
                </button>
                <button
                  onClick={() => setShowAddToPlaylist(true)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-all"
                >
                  <ListPlus className="w-4 h-4 text-white/40 hover:text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4">
              <button 
                onClick={player.toggleShuffle}
                className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer ${
                  player.shuffle ? 'text-[#FF4532]' : 'text-white/40 hover:text-white'
                }`}
              >
                <Shuffle className="w-4 h-4" />
              </button>
              <button 
                onClick={player.previous}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button 
                onClick={player.togglePlay}
                disabled={player.isLoading}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF4532] to-[#FF6B5B] flex items-center justify-center hover:scale-105 hover:shadow-[0_4px_20px_rgba(255,69,50,0.4)] transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {player.isLoading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : player.isPlaying ? (
                  <Pause className="w-5 h-5 text-white fill-white" />
                ) : (
                  <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                )}
              </button>
              <button 
                onClick={player.next}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
              <button 
                onClick={player.toggleRepeat}
                className={`w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer ${
                  player.repeat !== 'off' ? 'text-[#FF4532]' : 'text-white/40 hover:text-white'
                }`}
              >
                {player.repeat === 'one' ? (
                  <Repeat1 className="w-4 h-4" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md flex items-center gap-3">
              <span className="text-white/40 text-xs font-mono">
                {formatTime(player.progress)}
              </span>
              <div 
                className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const percent = x / rect.width
                  player.seek(percent * player.duration)
                }}
              >
                <div 
                  className="h-full bg-white/50 group-hover:bg-[#FF4532] transition-colors rounded-full relative"
                  style={{ width: `${player.duration > 0 ? (player.progress / player.duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                </div>
              </div>
              <span className="text-white/40 text-xs font-mono">
                {formatTime(player.duration)}
              </span>
            </div>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3 w-[150px]">
            <button 
              onClick={() => player.setVolume(player.volume === 0 ? 80 : 0)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <div 
              className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const percent = x / rect.width
                player.setVolume(Math.round(percent * 100))
              }}
            >
              <div 
                className="h-full bg-white/50 group-hover:bg-[#FF4532] transition-colors rounded-full" 
                style={{ width: `${player.volume}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add to Playlist Modal */}
      {showAddToPlaylist && player.currentTrack && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Add to Playlist</h3>
              <button
                onClick={() => setShowAddToPlaylist(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            {/* Current Track Info */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-xl">
              <img 
                src={player.currentTrack.cover} 
                alt={player.currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{player.currentTrack.title}</p>
                <p className="text-white/60 text-xs truncate">{player.currentTrack.artist}</p>
              </div>
            </div>

            {/* Playlists List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {(() => {
                const savedPlaylists = localStorage.getItem('myPlaylists')
                const playlists = savedPlaylists ? JSON.parse(savedPlaylists) : []
                
                if (playlists.length === 0) {
                  return (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 text-white/20 mx-auto mb-3" />
                      <p className="text-white/60 text-sm">No playlists yet</p>
                      <p className="text-white/40 text-xs mt-1">Create a playlist first</p>
                    </div>
                  )
                }

                return playlists.map((playlist: any) => (
                  <button
                    key={playlist.id}
                    onClick={() => {
                      // Add track to playlist
                      const savedPlaylists = localStorage.getItem('myPlaylists')
                      const allPlaylists = savedPlaylists ? JSON.parse(savedPlaylists) : []
                      
                      const updatedPlaylists = allPlaylists.map((p: any) => {
                        if (p.id === playlist.id) {
                          // Initialize tracks array if it doesn't exist
                          const tracks = p.tracks || []
                          
                          // Check if track already exists
                          const trackExists = tracks.some((t: any) => t.id === player.currentTrack?.id)
                          
                          if (!trackExists && player.currentTrack) {
                            return {
                              ...p,
                              tracks: [...tracks, {
                                id: player.currentTrack.id,
                                title: player.currentTrack.title,
                                artist: player.currentTrack.artist,
                                cover: player.currentTrack.cover,
                                duration: player.currentTrack.duration,
                                previewUrl: player.currentTrack.previewUrl
                              }],
                              trackCount: tracks.length + 1
                            }
                          }
                        }
                        return p
                      })
                      
                      localStorage.setItem('myPlaylists', JSON.stringify(updatedPlaylists))
                      setShowAddToPlaylist(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-left"
                  >
                    <img 
                      src={playlist.cover} 
                      alt={playlist.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{playlist.name}</p>
                      <p className="text-white/60 text-xs">{playlist.trackCount} tracks</p>
                    </div>
                    <div className="flex items-center gap-1 text-white/40">
                      {playlist.isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>
                  </button>
                ))
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to format time
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
