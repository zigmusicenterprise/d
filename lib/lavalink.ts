// Lavalink client configuration
export const LAVALINK_CONFIG = {
  host: process.env.LAVALINK_HOST || 'localhost',
  port: parseInt(process.env.LAVALINK_PORT || '2333'),
  password: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
  secure: process.env.LAVALINK_SECURE === 'true',
}

export function getLavalinkUrl() {
  const protocol = LAVALINK_CONFIG.secure ? 'https' : 'http'
  return `${protocol}://${LAVALINK_CONFIG.host}:${LAVALINK_CONFIG.port}`
}

export function getLavalinkHeaders() {
  return {
    'Authorization': LAVALINK_CONFIG.password,
    'Content-Type': 'application/json',
  }
}

export interface LavalinkTrack {
  encoded: string
  info: {
    identifier: string
    isSeekable: boolean
    author: string
    length: number
    isStream: boolean
    position: number
    title: string
    uri: string
    artworkUrl?: string
    sourceName: string
  }
}

export interface LoadTracksResponse {
  loadType: 'track' | 'playlist' | 'search' | 'empty' | 'error'
  data: LavalinkTrack[] | { tracks: LavalinkTrack[] } | null
}
