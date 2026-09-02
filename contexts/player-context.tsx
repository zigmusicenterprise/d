'use client'

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react'

interface Track {
  id: string
  encoded?: string
  title: string
  artist: string
  cover: string
  duration?: number
  durationFormatted?: string
  uri?: string
  previewUrl?: string
  source?: string
}

interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'
  isLoading: boolean
}

interface PlayerContextType extends PlayerState {
  play: (track?: Track) => void
  pause: () => void
  togglePlay: () => void
  next: () => void
  previous: () => void
  seek: (position: number) => void
  setVolume: (volume: number) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  playTrack: (track: Track) => void
  searchAndPlay: (query: string) => Promise<void>
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider')
  }
  return context
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 80,
    progress: 0,
    duration: 0,
    shuffle: false,
    repeat: 'off',
    isLoading: false,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.volume = state.volume / 100
      audioRef.current.crossOrigin = 'anonymous'
      audioRef.current.preload = 'metadata'
      
      // Tentar habilitar autoplay (funciona em alguns navegadores)
      audioRef.current.setAttribute('playsinline', 'true')

      audioRef.current.addEventListener('ended', handleTrackEnd)
      audioRef.current.addEventListener('loadedmetadata', () => {
        setState(s => ({ ...s, duration: audioRef.current?.duration || 0 }))
      })
      audioRef.current.addEventListener('canplay', () => {
        setState(s => ({ ...s, isLoading: false }))
      })
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e)
        setState(s => ({ ...s, isLoading: false }))
      })

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.removeEventListener('ended', handleTrackEnd)
        }
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
      }
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume / 100
    }
  }, [state.volume])

  // Progress tracking
  useEffect(() => {
    if (state.isPlaying) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setState(s => ({ ...s, progress: audioRef.current?.currentTime || 0 }))
        }
      }, 100)
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [state.isPlaying])

  const handleTrackEnd = useCallback(() => {
    if (state.repeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      next()
    }
  }, [state.repeat])

  const getStreamUrl = async (track: Track): Promise<string | null> => {
    try {
      // Primeiro tenta buscar stream via Lavalink
      const searchQuery = `${track.title} ${track.artist}`.trim()
      const res = await fetch(`/api/lavalink/stream?query=${encodeURIComponent(searchQuery)}`)
      
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.streamUrl) {
          console.log('🎵 Got Lavalink stream URL')
          return data.streamUrl
        }
      }
      
      // Fallback para preview se disponível
      if (track.previewUrl) {
        console.log('🎵 Using preview URL')
        return track.previewUrl
      }
      
      return null
    } catch (err) {
      console.error('Error getting stream:', err)
      return track.previewUrl || null
    }
  }

  const playTrack = useCallback(async (track: Track) => {
    if (!audioRef.current) return

    setState(s => ({ ...s, currentTrack: track, progress: 0, isLoading: true }))

    const audioUrl = await getStreamUrl(track)

    if (audioUrl) {
      audioRef.current.src = audioUrl
      
      // Tentar reproduzir com tratamento de erro de autoplay
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setState(s => ({ ...s, isPlaying: true, isLoading: false }))
          })
          .catch(err => {
            // Erro de autoplay - navegador bloqueou
            if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
              console.warn('⚠️ Autoplay bloqueado. Aguardando interação do usuário.')
              setState(s => ({ ...s, isPlaying: false, isLoading: false }))
              // Áudio está carregado, mas precisa de interação do usuário
            } else {
              console.error('Play error:', err)
              setState(s => ({ ...s, isLoading: false }))
            }
          })
      }
    } else {
      console.log('No audio URL available for track:', track.title)
      setState(s => ({ ...s, isPlaying: false, isLoading: false }))
    }
  }, [])

  const play = useCallback((track?: Track) => {
    if (track) {
      playTrack(track)
    } else if (audioRef.current && state.currentTrack) {
      const playPromise = audioRef.current.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => setState(s => ({ ...s, isPlaying: true })))
          .catch(err => {
            if (err.name === 'NotAllowedError' || err.name === 'AbortError') {
              console.warn('⚠️ Autoplay bloqueado. Clique no botão play.')
            } else {
              console.error('Play error:', err)
            }
          })
      }
    }
  }, [state.currentTrack, playTrack])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setState(s => ({ ...s, isPlaying: false }))
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [state.isPlaying, play, pause])

  const next = useCallback(() => {
    if (state.queue.length > 0) {
      const nextTrack = state.shuffle 
        ? state.queue[Math.floor(Math.random() * state.queue.length)]
        : state.queue[0]
      
      setState(s => ({
        ...s,
        queue: s.queue.filter(t => t.id !== nextTrack.id)
      }))
      playTrack(nextTrack)
    } else if (state.repeat === 'all' && state.currentTrack) {
      playTrack(state.currentTrack)
    } else {
      pause()
    }
  }, [state.queue, state.shuffle, state.repeat, state.currentTrack, playTrack, pause])

  const previous = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
    } else if (state.currentTrack) {
      playTrack(state.currentTrack)
    }
  }, [state.currentTrack, playTrack])

  const seek = useCallback((position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position
      setState(s => ({ ...s, progress: position }))
    }
  }, [])

  const setVolume = useCallback((volume: number) => {
    setState(s => ({ ...s, volume: Math.max(0, Math.min(100, volume)) }))
  }, [])

  const addToQueue = useCallback((track: Track) => {
    setState(s => ({ ...s, queue: [...s.queue, track] }))
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setState(s => ({ ...s, queue: s.queue.filter((_, i) => i !== index) }))
  }, [])

  const clearQueue = useCallback(() => {
    setState(s => ({ ...s, queue: [] }))
  }, [])

  const toggleShuffle = useCallback(() => {
    setState(s => ({ ...s, shuffle: !s.shuffle }))
  }, [])

  const toggleRepeat = useCallback(() => {
    setState(s => ({
      ...s,
      repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off'
    }))
  }, [])

  const searchAndPlay = useCallback(async (query: string) => {
    try {
      setState(s => ({ ...s, isLoading: true }))
      
      const res = await fetch(`/api/lavalink/search?query=${encodeURIComponent(query)}&source=ytsearch`)
      const data = await res.json()
      
      if (data.tracks && data.tracks.length > 0) {
        const track = data.tracks[0]
        await playTrack({
          id: track.id,
          encoded: track.encoded,
          title: track.title,
          artist: track.artist,
          cover: track.cover,
          duration: track.duration,
          durationFormatted: track.durationFormatted,
          uri: track.uri,
        })
        
        // Add rest to queue
        if (data.tracks.length > 1) {
          const queueTracks = data.tracks.slice(1, 10).map((t: any) => ({
            id: t.id,
            encoded: t.encoded,
            title: t.title,
            artist: t.artist,
            cover: t.cover,
            duration: t.duration,
            durationFormatted: t.durationFormatted,
            uri: t.uri,
          }))
          setState(s => ({ ...s, queue: [...s.queue, ...queueTracks] }))
        }
      }
    } catch (err) {
      console.error('Search and play error:', err)
      setState(s => ({ ...s, isLoading: false }))
    }
  }, [playTrack])

  const value: PlayerContextType = {
    ...state,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    addToQueue,
    removeFromQueue,
    clearQueue,
    toggleShuffle,
    toggleRepeat,
    playTrack,
    searchAndPlay,
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}
