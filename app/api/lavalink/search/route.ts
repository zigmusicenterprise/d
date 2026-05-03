import { NextResponse } from 'next/server'

const LAVALINK_HOST = process.env.LAVALINK_HOST || 'localhost'
const LAVALINK_PORT = process.env.LAVALINK_PORT || '2333'
const LAVALINK_PASSWORD = process.env.LAVALINK_PASSWORD || 'youshallnotpass'
const LAVALINK_SECURE = process.env.LAVALINK_SECURE === 'true'

function getLavalinkUrl() {
  const protocol = LAVALINK_SECURE ? 'https' : 'http'
  return `${protocol}://${LAVALINK_HOST}:${LAVALINK_PORT}`
}

// Buscar música no Lavalink
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const source = searchParams.get('source') || 'ytsearch' // ytsearch, scsearch, etc

  if (!query) {
    return NextResponse.json({ error: 'Query é obrigatória' }, { status: 400 })
  }

  try {
    const searchQuery = query.startsWith('http') ? query : `${source}:${query}`
    const url = `${getLavalinkUrl()}/v4/loadtracks?identifier=${encodeURIComponent(searchQuery)}`
    
    console.log('🎵 Lavalink search:', searchQuery)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': LAVALINK_PASSWORD,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lavalink error:', response.status, errorText)
      return NextResponse.json({ 
        error: 'Erro ao buscar no Lavalink',
        details: errorText 
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('🎵 Lavalink response:', data.loadType)

    // Formatar resposta
    let tracks: any[] = []
    
    if (data.loadType === 'track') {
      tracks = [data.data]
    } else if (data.loadType === 'search' || data.loadType === 'playlist') {
      tracks = Array.isArray(data.data) ? data.data : data.data?.tracks || []
    }

    const formattedTracks = tracks.map((track: any) => ({
      encoded: track.encoded,
      id: track.info?.identifier || track.encoded,
      title: track.info?.title || 'Unknown',
      artist: track.info?.author || 'Unknown',
      duration: track.info?.length || 0,
      durationFormatted: formatDuration(track.info?.length || 0),
      uri: track.info?.uri || '',
      cover: track.info?.artworkUrl || getYouTubeThumbnail(track.info?.identifier),
      source: track.info?.sourceName || 'unknown',
      isStream: track.info?.isStream || false,
    }))

    return NextResponse.json({ 
      loadType: data.loadType,
      tracks: formattedTracks 
    })

  } catch (error) {
    console.error('Lavalink fetch error:', error)
    return NextResponse.json({ 
      error: 'Falha ao conectar com Lavalink',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

function formatDuration(ms: number): string {
  if (ms === 0) return '0:00'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function getYouTubeThumbnail(videoId?: string): string {
  if (!videoId) return ''
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

export const dynamic = 'force-dynamic'
