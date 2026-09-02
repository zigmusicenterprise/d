// Spotify API Integration
// Para usar, crie uma aplicação em: https://developer.spotify.com/dashboard
// E adicione as variáveis de ambiente no arquivo .env.local

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ''
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || ''

interface SpotifyToken {
  access_token: string
  token_type: string
  expires_in: number
}

interface SpotifyImage {
  url: string
  height: number
  width: number
}

interface SpotifyArtist {
  id: string
  name: string
  images?: SpotifyImage[]
}

interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  artists: SpotifyArtist[]
  release_date: string
}

interface SpotifyTrack {
  id: string
  name: string
  duration_ms: number
  album: SpotifyAlbum
  artists: SpotifyArtist[]
  preview_url: string | null
}

interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  tracks: {
    total: number
  }
}

// Obter token de acesso usando Client Credentials Flow
async function getAccessToken(): Promise<string> {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store'
  })

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token')
  }

  const data: SpotifyToken = await response.json()
  return data.access_token
}

// Buscar novos lançamentos
export async function getNewReleases(limit: number = 10) {
  try {
    const token = await getAccessToken()
    
    const response = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}&country=BR`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 } // Cache por 1 hora
    })

    if (!response.ok) {
      throw new Error('Failed to fetch new releases')
    }

    const data = await response.json()
    
    return data.albums.items.map((album: SpotifyAlbum) => ({
      id: album.id,
      title: album.name,
      artist: album.artists.map(a => a.name).join(', '),
      cover: album.images[0]?.url || '',
      releaseDate: album.release_date
    }))
  } catch (error) {
    console.error('Spotify API Error:', error)
    return null
  }
}

// Buscar playlists em destaque
export async function getFeaturedPlaylists(limit: number = 10) {
  try {
    const token = await getAccessToken()
    
    const response = await fetch(`https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}&country=BR`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch featured playlists')
    }

    const data = await response.json()
    
    return data.playlists.items.map((playlist: SpotifyPlaylist) => ({
      id: playlist.id,
      title: playlist.name,
      description: playlist.description,
      cover: playlist.images[0]?.url || '',
      totalTracks: playlist.tracks.total
    }))
  } catch (error) {
    console.error('Spotify API Error:', error)
    return null
  }
}

// Buscar top tracks de um país
export async function getTopTracks(limit: number = 10) {
  try {
    const token = await getAccessToken()
    
    // Playlist "Top 50 - Brazil" do Spotify
    const response = await fetch(`https://api.spotify.com/v1/playlists/37i9dQZEVXbMXbN3EUUhlg/tracks?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { revalidate: 3600 }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch top tracks')
    }

    const data = await response.json()
    
    return data.items.map((item: { track: SpotifyTrack }, index: number) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists.map(a => a.name).join(', '),
      cover: item.track.album.images[0]?.url || '',
      duration: formatDuration(item.track.duration_ms),
      previewUrl: item.track.preview_url,
      position: index + 1
    }))
  } catch (error) {
    console.error('Spotify API Error:', error)
    return null
  }
}

// Buscar por artista, álbum ou música
export async function search(query: string, type: 'track' | 'artist' | 'album' = 'track', limit: number = 10) {
  try {
    const token = await getAccessToken()
    
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}&market=BR`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to search')
    }

    const data = await response.json()
    
    if (type === 'track') {
      return data.tracks.items.map((track: SpotifyTrack) => ({
        id: track.id,
        title: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        cover: track.album.images[0]?.url || '',
        duration: formatDuration(track.duration_ms),
        previewUrl: track.preview_url
      }))
    }
    
    if (type === 'artist') {
      return data.artists.items.map((artist: SpotifyArtist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images?.[0]?.url || ''
      }))
    }
    
    if (type === 'album') {
      return data.albums.items.map((album: SpotifyAlbum) => ({
        id: album.id,
        title: album.name,
        artist: album.artists.map(a => a.name).join(', '),
        cover: album.images[0]?.url || '',
        releaseDate: album.release_date
      }))
    }
    
    return null
  } catch (error) {
    console.error('Spotify API Error:', error)
    return null
  }
}

// Formatar duração de milissegundos para MM:SS
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

// Verificar se as credenciais estão configuradas
export function isSpotifyConfigured(): boolean {
  return !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET)
}
