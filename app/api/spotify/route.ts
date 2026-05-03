import { NextResponse } from 'next/server'

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'new-releases'
  const limit = searchParams.get('limit') || '10'
  const query = searchParams.get('q') || ''

  console.log('🎵 Music API called:', { type, limit, query })

  try {
    let result: any[] = []

    switch (type) {
      case 'new-releases':
        // Buscar lançamentos populares
        const releasesRes = await fetch(
          `https://itunes.apple.com/search?term=2024+2025+new+music&media=music&entity=song&limit=${limit}&country=BR`
        )
        const releasesData = await releasesRes.json()
        result = releasesData.results?.map((track: any) => ({
          id: track.trackId?.toString() || Math.random().toString(),
          title: track.trackName,
          artist: track.artistName,
          cover: track.artworkUrl100?.replace('100x100', '600x600') || '',
          duration: formatDuration(track.trackTimeMillis || 0),
          previewUrl: track.previewUrl,
          releaseDate: track.releaseDate
        })) || []
        break

      case 'top-tracks':
        // Buscar músicas populares
        const topRes = await fetch(
          `https://itunes.apple.com/search?term=top+hits+pop&media=music&entity=song&limit=${limit}&country=BR`
        )
        const topData = await topRes.json()
        result = topData.results?.map((track: any, index: number) => ({
          id: track.trackId?.toString() || Math.random().toString(),
          title: track.trackName,
          artist: track.artistName,
          cover: track.artworkUrl100?.replace('100x100', '600x600') || '',
          duration: formatDuration(track.trackTimeMillis || 0),
          previewUrl: track.previewUrl,
          position: index + 1
        })) || []
        break

      case 'featured-playlists':
        // Simular playlists com álbuns populares
        const playlistsRes = await fetch(
          `https://itunes.apple.com/search?term=best+album&media=music&entity=album&limit=${limit}&country=BR`
        )
        const playlistsData = await playlistsRes.json()
        result = playlistsData.results?.map((album: any) => ({
          id: album.collectionId?.toString() || Math.random().toString(),
          title: album.collectionName,
          description: `By ${album.artistName}`,
          cover: album.artworkUrl100?.replace('100x100', '600x600') || '',
          totalTracks: album.trackCount || 0
        })) || []
        break

      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
        }
        console.log('🔍 Searching iTunes for:', query)
        const searchRes = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&country=BR`
        )
        const searchData = await searchRes.json()
        console.log('🔍 iTunes response:', searchData.resultCount, 'results')
        result = searchData.results?.map((track: any) => ({
          id: track.trackId?.toString() || Math.random().toString(),
          title: track.trackName,
          artist: track.artistName,
          cover: track.artworkUrl100?.replace('100x100', '600x600') || '',
          duration: formatDuration(track.trackTimeMillis || 0),
          previewUrl: track.previewUrl
        })) || []
        break

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    console.log('✅ Returning', result.length, 'results')
    return NextResponse.json(
      { data: result },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )

  } catch (error) {
    console.error('Music API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch music data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Desabilitar cache do Next.js
export const dynamic = 'force-dynamic'
export const revalidate = 0
