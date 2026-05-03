import { NextResponse } from 'next/server'

const LAVALINK_HOST = process.env.LAVALINK_HOST || 'localhost'
const LAVALINK_PORT = process.env.LAVALINK_PORT || '2333'
const LAVALINK_PASSWORD = process.env.LAVALINK_PASSWORD || 'youshallnotpass'
const LAVALINK_SECURE = process.env.LAVALINK_SECURE === 'true'

function getLavalinkUrl() {
  const protocol = LAVALINK_SECURE ? 'https' : 'http'
  return `${protocol}://${LAVALINK_HOST}:${LAVALINK_PORT}`
}

// Lista de instâncias Piped para fallback (mais estáveis que Invidious)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.tokhmi.xyz',
  'https://api-piped.mha.fi',
  'https://pipedapi.aeong.one',
  'https://piped-api.garudalinux.org',
  'https://pipedapi.r4fo.com',
  'https://api.piped.yt',
  'https://pipedapi.adminforge.de',
]

async function getStreamFromPiped(videoId: string): Promise<string | null> {
  for (const instance of PIPED_INSTANCES) {
    try {
      console.log(`Trying Piped instance: ${instance}`)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8s timeout
      
      const res = await fetch(`${instance}/streams/${videoId}`, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (res.ok) {
        const data = await res.json()
        // Piped retorna audioStreams diretamente
        const audioStreams = data.audioStreams || []
        
        if (audioStreams.length > 0) {
          // Pegar stream de maior qualidade (maior bitrate)
          const sorted = audioStreams
            .filter((s: any) => s.url && s.mimeType?.includes('audio'))
            .sort((a: any, b: any) => (b.bitrate || 0) - (a.bitrate || 0))
          
          if (sorted.length > 0) {
            console.log(`✅ Got stream from ${instance}`)
            return sorted[0].url
          }
        }
      } else {
        console.log(`Piped instance ${instance} returned status: ${res.status}`)
      }
    } catch (err: any) {
      console.log(`Piped instance ${instance} failed:`, err.message || err)
    }
  }
  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || ''
  const encoded = searchParams.get('encoded') || ''

  if (!query && !encoded) {
    return NextResponse.json({ error: 'Query ou encoded é obrigatório' }, { status: 400 })
  }

  try {
    let videoUrl = ''
    let videoId = ''
    let trackInfo: any = null

    // Se temos encoded, decodificar para pegar a URL
    if (encoded) {
      const decodeRes = await fetch(`${getLavalinkUrl()}/v4/decodetrack?encodedTrack=${encodeURIComponent(encoded)}`, {
        headers: { 'Authorization': LAVALINK_PASSWORD }
      })
      
      if (decodeRes.ok) {
        trackInfo = await decodeRes.json()
        videoUrl = trackInfo.uri || ''
        videoId = trackInfo.identifier || ''
      }
    }

    // Se não temos URL ainda, buscar no Lavalink
    if (!videoUrl && query) {
      const searchQuery = query.startsWith('http') ? query : `ytsearch:${query}`
      const searchRes = await fetch(
        `${getLavalinkUrl()}/v4/loadtracks?identifier=${encodeURIComponent(searchQuery)}`,
        { headers: { 'Authorization': LAVALINK_PASSWORD } }
      )

      if (searchRes.ok) {
        const data = await searchRes.json()
        let tracks = []
        
        if (data.loadType === 'track') {
          tracks = [data.data]
        } else if (data.loadType === 'search' || data.loadType === 'playlist') {
          tracks = Array.isArray(data.data) ? data.data : data.data?.tracks || []
        }

        if (tracks.length > 0) {
          trackInfo = tracks[0].info
          videoUrl = trackInfo?.uri || ''
          videoId = trackInfo?.identifier || ''
        }
      }
    }

    // Extrair videoId da URL se necessário
    if (!videoId && videoUrl) {
      const match = videoUrl.match(/(?:v=|\/)([\w-]{11})/)
      videoId = match ? match[1] : ''
    }

    if (!videoId) {
      return NextResponse.json({ error: 'Não foi possível encontrar a música' }, { status: 404 })
    }

    console.log('🎵 Getting stream for video ID:', videoId)

    // Obter stream via Piped API
    const streamUrl = await getStreamFromPiped(videoId)

    if (!streamUrl) {
      return NextResponse.json({ error: 'Não foi possível obter o stream de áudio' }, { status: 404 })
    }

    console.log('✅ Got stream URL')

    return NextResponse.json({
      success: true,
      streamUrl,
      track: trackInfo ? {
        title: trackInfo.title,
        artist: trackInfo.author,
        duration: trackInfo.length,
        cover: trackInfo.artworkUrl || `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        uri: trackInfo.uri || videoUrl,
      } : null
    })

  } catch (error) {
    console.error('Stream error:', error)
    return NextResponse.json({ 
      error: 'Erro ao obter stream',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
