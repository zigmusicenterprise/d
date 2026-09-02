"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { ToastNotification } from "@/components/toast-notification"

interface Track {
  id: string
  title: string
  artist: string
  album?: string
  cover: string
  duration?: string
  previewUrl?: string
}

interface Artist {
  id: string
  name: string
  followers: string
  cover: string
}

interface FavoritesContextType {
  favoriteTracks: Track[]
  followedArtists: Artist[]
  addFavorite: (track: Track) => void
  removeFavorite: (trackId: string) => void
  isFavorite: (trackId: string) => boolean
  followArtist: (artist: Artist) => void
  unfollowArtist: (artistId: string) => void
  isFollowing: (artistId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([])
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([])
  const [toast, setToast] = useState<{ message: string; type: "favorite" | "unfavorite" | "follow" | "unfollow"; show: boolean }>({
    message: "",
    type: "favorite",
    show: false
  })

  // Load from localStorage on mount
  useEffect(() => {
    const storedTracks = localStorage.getItem("favoriteTracks")
    const storedArtists = localStorage.getItem("followedArtists")
    
    if (storedTracks) {
      setFavoriteTracks(JSON.parse(storedTracks))
    }
    if (storedArtists) {
      setFollowedArtists(JSON.parse(storedArtists))
    }
  }, [])

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("favoriteTracks", JSON.stringify(favoriteTracks))
  }, [favoriteTracks])

  useEffect(() => {
    localStorage.setItem("followedArtists", JSON.stringify(followedArtists))
  }, [followedArtists])

  const addFavorite = (track: Track) => {
    setFavoriteTracks((prev) => {
      // Check if already exists
      if (prev.some((t) => t.id === track.id)) {
        return prev
      }
      setToast({ message: `Added "${track.title}" to favorites`, type: "favorite", show: true })
      return [...prev, { ...track, addedAt: new Date().toISOString() }]
    })
  }

  const removeFavorite = (trackId: string) => {
    const track = favoriteTracks.find((t) => t.id === trackId)
    if (track) {
      setToast({ message: `Removed "${track.title}" from favorites`, type: "unfavorite", show: true })
    }
    setFavoriteTracks((prev) => prev.filter((t) => t.id !== trackId))
  }

  const isFavorite = (trackId: string) => {
    return favoriteTracks.some((t) => t.id === trackId)
  }

  const followArtist = (artist: Artist) => {
    setFollowedArtists((prev) => {
      // Check if already following
      if (prev.some((a) => a.id === artist.id)) {
        return prev
      }
      setToast({ message: `Following ${artist.name}`, type: "follow", show: true })
      return [...prev, { ...artist, followedAt: new Date().toISOString() }]
    })
  }

  const unfollowArtist = (artistId: string) => {
    const artist = followedArtists.find((a) => a.id === artistId)
    if (artist) {
      setToast({ message: `Unfollowed ${artist.name}`, type: "unfollow", show: true })
    }
    setFollowedArtists((prev) => prev.filter((a) => a.id !== artistId))
  }

  const isFollowing = (artistId: string) => {
    return followedArtists.some((a) => a.id === artistId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteTracks,
        followedArtists,
        addFavorite,
        removeFavorite,
        isFavorite,
        followArtist,
        unfollowArtist,
        isFollowing,
      }}
    >
      {children}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
