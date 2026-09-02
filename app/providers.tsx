'use client'

import { PlayerProvider } from '@/contexts/player-context'
import { FavoritesProvider } from '@/contexts/favorites-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PlayerProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </PlayerProvider>
  )
}
