"use client"

import { useState, useEffect } from "react"
import { Play, Plus, Music, Lock, Globe, Users, X, Upload, Trash2, ArrowLeft, MoreVertical } from "lucide-react"

interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  trackCount: number
  isPublic: boolean
  isCollaborative?: boolean
  creator: string
}

interface PlaylistsTabProps {
  onPlayTrack: (track: any) => void
}

export function PlaylistsTab({ onPlayTrack }: PlaylistsTabProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [playlistName, setPlaylistName] = useState("")
  const [playlistDescription, setPlaylistDescription] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  const defaultPlaylists: Playlist[] = [
    { id: "1", name: "My Favorites", description: "All my favorite tracks", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300", trackCount: 0, isPublic: false, creator: "You" },
    { id: "2", name: "Workout Mix", description: "High energy tracks", cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300", trackCount: 0, isPublic: true, creator: "You" },
    { id: "3", name: "Chill Vibes", description: "Relaxing music", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300", trackCount: 0, isPublic: true, creator: "You" },
  ]

  const [myPlaylists, setMyPlaylists] = useState<Playlist[]>([])

  // Load playlists from localStorage on mount
  useEffect(() => {
    const loadPlaylists = () => {
      const saved = localStorage.getItem('myPlaylists')
      if (saved) {
        setMyPlaylists(JSON.parse(saved))
      } else {
        setMyPlaylists(defaultPlaylists)
        localStorage.setItem('myPlaylists', JSON.stringify(defaultPlaylists))
      }
    }
    
    loadPlaylists()
    
    // Recarregar quando a tab fica visível
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadPlaylists()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Recarregar a cada 1 segundo para pegar mudanças
    const interval = setInterval(loadPlaylists, 1000)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(interval)
    }
  }, [])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (myPlaylists.length > 0) {
      localStorage.setItem('myPlaylists', JSON.stringify(myPlaylists))
    }
  }, [myPlaylists])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreatePlaylist = () => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: playlistName,
      description: playlistDescription,
      cover: coverImage || "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300",
      trackCount: 0,
      isPublic: isPublic,
      creator: "You"
    }

    setMyPlaylists([newPlaylist, ...myPlaylists])
    setShowCreateModal(false)
    setPlaylistName("")
    setPlaylistDescription("")
    setIsPublic(true)
    setCoverImage(null)
  }

  const handleDeletePlaylist = (id: string) => {
    setMyPlaylists(myPlaylists.filter(p => p.id !== id))
    setShowDeleteConfirm(null)
  }

  // Se uma playlist está selecionada, mostrar a view de detalhes
  if (selectedPlaylist) {
    // Recarregar playlist do localStorage para pegar tracks atualizadas
    const savedPlaylists = localStorage.getItem('myPlaylists')
    const allPlaylists = savedPlaylists ? JSON.parse(savedPlaylists) : []
    const currentPlaylist = allPlaylists.find((p: any) => p.id === selectedPlaylist.id) || selectedPlaylist
    const tracks = currentPlaylist.tracks || []
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{selectedPlaylist.name}</h2>
            <p className="text-white/60">{selectedPlaylist.description}</p>
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex gap-6 items-end">
          <img 
            src={selectedPlaylist.cover} 
            alt={selectedPlaylist.name}
            className="w-48 h-48 rounded-2xl object-cover shadow-2xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              {selectedPlaylist.isPublic ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                  <Globe className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Public</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                  <Lock className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">Private</span>
                </div>
              )}
              <span className="text-white/60 text-sm">{tracks.length} tracks</span>
            </div>
            {tracks.length > 0 && (
              <button 
                onClick={() => {
                  if (tracks[0]) {
                    onPlayTrack(tracks[0])
                  }
                }}
                className="px-8 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-white" />
                Play All
              </button>
            )}
          </div>
        </div>

        {/* Tracks List */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          {tracks.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/60 mb-4">This playlist is empty</p>
              <p className="text-white/40 text-sm">Add songs from the player or search</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tracks.map((track: any, index: number) => (
                <div
                  key={track.id + index}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <span className="text-white/40 text-sm w-6 text-center">{index + 1}</span>
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{track.title}</p>
                    <p className="text-white/60 text-xs truncate">{track.artist}</p>
                  </div>
                  <span className="text-white/40 text-xs">{track.duration || '0:00'}</span>
                  <button
                    onClick={() => onPlayTrack(track)}
                    className="w-10 h-10 rounded-lg bg-[#FF4532] hover:bg-[#d44a42] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const collaborativePlaylists: Playlist[] = [
    { id: "4", name: "Party Hits", description: "Collaborative party playlist", cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300", trackCount: 67, isPublic: true, isCollaborative: true, creator: "John & 5 others" },
    { id: "5", name: "Road Trip", description: "Best songs for the road", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300", trackCount: 54, isPublic: true, isCollaborative: true, creator: "Sarah & 3 others" },
  ]

  const featuredPlaylists: Playlist[] = [
    { id: "6", name: "PHONK by ZIG", description: "Curated by ZIG", cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300", trackCount: 100, isPublic: true, creator: "ZIG Curated" },
    { id: "7", name: "TRAP by ZIG", description: "Best trap music", cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300", trackCount: 85, isPublic: true, creator: "ZIG Curated" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Playlists</h2>
          <p className="text-white/60">Create and manage your music collections</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Playlist
        </button>
      </div>

      {/* My Playlists */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">My Playlists</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myPlaylists.map((playlist) => (
            <div key={playlist.id} className="group cursor-pointer relative">
              <div 
                className="relative aspect-square mb-3 overflow-hidden rounded-2xl"
                onClick={() => setSelectedPlaylist(playlist)}
              >
                <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-14 h-14 rounded-full bg-[#FF4532] flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </button>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {playlist.isPublic ? (
                    <Globe className="w-5 h-5 text-white drop-shadow-lg" />
                  ) : (
                    <Lock className="w-5 h-5 text-white drop-shadow-lg" />
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-white text-sm font-medium drop-shadow-lg">{playlist.trackCount} tracks</span>
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0" onClick={() => setSelectedPlaylist(playlist)}>
                  <h4 className="text-white font-medium truncate group-hover:text-[#FF4532] transition-colors">{playlist.name}</h4>
                  <p className="text-white/50 text-sm truncate">{playlist.description}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm(showDeleteConfirm === playlist.id ? null : playlist.id)
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-white/60" />
                  </button>
                  {showDeleteConfirm === playlist.id && (
                    <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-xl p-2 shadow-xl z-10 min-w-[120px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePlaylist(playlist.id)
                        }}
                        className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborative Playlists */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#FF4532]" />
          Collaborative Playlists
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collaborativePlaylists.map((playlist) => (
            <div key={playlist.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all cursor-pointer group flex gap-4">
              <img src={playlist.cover} alt={playlist.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold mb-1 truncate group-hover:text-[#FF4532] transition-colors">{playlist.name}</h4>
                <p className="text-white/50 text-sm mb-2 truncate">{playlist.description}</p>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    {playlist.trackCount} tracks
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {playlist.creator}
                  </span>
                </div>
              </div>
              <button className="w-12 h-12 rounded-full bg-[#FF4532] hover:bg-[#d44a42] flex items-center justify-center transition-colors flex-shrink-0">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Playlists */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Featured by ZIG</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredPlaylists.map((playlist) => (
            <div key={playlist.id} className="group cursor-pointer">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-2xl">
                <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="w-14 h-14 rounded-full bg-[#FF4532] flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </button>
                </div>
              </div>
              <h4 className="text-white font-medium truncate group-hover:text-[#FF4532] transition-colors">{playlist.name}</h4>
              <p className="text-white/50 text-sm truncate">{playlist.creator}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Create New Playlist</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setPlaylistName("")
                  setPlaylistDescription("")
                  setIsPublic(true)
                  setCoverImage(null)
                }}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Cover Image */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="cover-upload"
                />
                <label
                  htmlFor="cover-upload"
                  className="block w-32 h-32 mx-auto bg-white/5 border-2 border-dashed border-white/20 rounded-xl overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                >
                  {coverImage ? (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-white/40 mb-1" />
                      <span className="text-white/40 text-xs">Upload</span>
                    </div>
                  )}
                </label>
              </div>

              {/* Playlist Name */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Playlist Name</label>
                <input
                  type="text"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  placeholder="My Awesome Playlist"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Description</label>
                <textarea
                  value={playlistDescription}
                  onChange={(e) => setPlaylistDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF4532]/50 resize-none"
                />
              </div>

              {/* Privacy */}
              <div>
                <label className="block text-white/70 text-sm mb-2">Privacy</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsPublic(true)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      isPublic
                        ? "bg-[#FF4532] border-[#FF4532] text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Public</span>
                  </button>
                  <button
                    onClick={() => setIsPublic(false)}
                    className={`flex-1 px-4 py-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      !isPublic
                        ? "bg-[#FF4532] border-[#FF4532] text-white"
                        : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-sm font-medium">Private</span>
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setPlaylistName("")
                    setPlaylistDescription("")
                    setIsPublic(true)
                    setCoverImage(null)
                  }}
                  className="flex-1 px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!playlistName.trim()}
                  className="flex-1 px-6 py-2.5 bg-[#FF4532] hover:bg-[#d44a42] rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
