"use client"

import { useState, useRef } from "react"

interface WaveformProps {
  progress?: number
  onProgressChange?: (progress: number) => void
  height?: number
}

export function Waveform({ progress = 0, onProgressChange, height = 60 }: WaveformProps) {
  const [hoverProgress, setHoverProgress] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Generate random waveform bars
  const bars = Array.from({ length: 150 }, () => Math.random() * 0.7 + 0.3)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !onProgressChange) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const newProgress = (x / rect.width) * 100
    onProgressChange(Math.max(0, Math.min(100, newProgress)))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    setHoverProgress((x / rect.width) * 100)
  }

  return (
    <div
      ref={containerRef}
      className="w-full cursor-pointer relative"
      style={{ height }}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverProgress(null)}
    >
      <div className="flex items-end justify-between h-full gap-[1px]">
        {bars.map((barHeight, index) => {
          const barProgress = (index / bars.length) * 100
          const isPlayed = barProgress <= progress
          const isHovered = hoverProgress !== null && barProgress <= hoverProgress

          return (
            <div
              key={index}
              className="flex-1 rounded-sm transition-colors duration-75"
              style={{
                height: `${barHeight * 100}%`,
                backgroundColor: isPlayed 
                  ? '#e31b23' 
                  : isHovered 
                    ? '#666666' 
                    : '#3a3a3a',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
