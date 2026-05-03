import { useState, useEffect } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  cover: string
  duration?: string
  previewUrl?: string | null
  position?: number
  releaseDate?: string
}

interface Playlist {
  id: string
  title: string
  description: string
  cover: string
  totalTracks: number
}

type SpotifyDataType = 'new-releases' | 'featured-playlists' | 'top-tracks' | 'search'

interface UseSpotifyOptions {
  type: SpotifyDataType
  limit?: number
  query?: string
  enabled?: boolean
}

export function useSpotify<T = Track[]>({ type, limit = 10, query, enabled = true }: UseSpotifyOptions) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setData(null)
      return
    }

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          type,
          limit: limit.toString(),
          ...(query && { q: query })
        })

        console.log('Fetching Spotify:', type, query)
        const response = await fetch(`/api/spotify?${params}`)
        const result = await response.json()
        console.log('Spotify response:', result)

        if (!response.ok) {
          throw new Error(result.message || result.error || 'Failed to fetch')
        }

        setData(result.data)
      } catch (err) {
        console.error('Spotify fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [type, limit, query, enabled])

  return { data, loading, error, refetch: () => {} }
}

// Hook específico para novos lançamentos
export function useNewReleases(limit: number = 10) {
  return useSpotify<Track[]>({ type: 'new-releases', limit })
}

// Hook específico para top tracks
export function useTopTracks(limit: number = 10) {
  return useSpotify<Track[]>({ type: 'top-tracks', limit })
}

// Hook específico para playlists em destaque
export function useFeaturedPlaylists(limit: number = 10) {
  return useSpotify<Playlist[]>({ type: 'featured-playlists', limit })
}

// Hook para busca
export function useSpotifySearch(query: string, limit: number = 10) {
  return useSpotify<Track[]>({ type: 'search', limit, query, enabled: query.length > 0 })
}
