"use client"

import { useState, useRef } from "react"
import Link from "next/link"

export function Footer() {
  const [email, setEmail] = useState("")
  const [footerStyle, setFooterStyle] = useState({
    '--footer-px': '50%',
    '--footer-py': '50%',
    '--footer-opacity': '0'
  } as React.CSSProperties)
  const footerRef = useRef<HTMLElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!footerRef.current) return
    const rect = footerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setFooterStyle({
      '--footer-px': `${x}px`,
      '--footer-py': `${y}px`,
      '--footer-opacity': '1'
    } as React.CSSProperties)
  }

  const handleMouseLeave = () => {
    setFooterStyle(prev => ({
      ...prev,
      '--footer-opacity': '0'
    } as React.CSSProperties))
  }

  const handleMouseEnter = () => {
    setFooterStyle(prev => ({
      ...prev,
      '--footer-opacity': '1'
    } as React.CSSProperties))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Email submitted:", email)
    setEmail("")
  }

  return (
    <footer 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={footerStyle}
      className="relative bg-black w-full pt-[15vh] pb-[5vh] px-[5%] overflow-hidden text-white border-t border-white/5"
    >
      {/* Background Text */}
      <div 
        className="footer-bg-text absolute bottom-[2vh] left-0 w-full text-center text-[45vw] font-extrabold leading-[0.8] pointer-events-none z-0 select-none"
        style={{
          opacity: 'var(--footer-opacity, 0)',
          background: `radial-gradient(800px circle at var(--footer-px, 50%) var(--footer-py, 50%), rgba(255, 134, 126, 0.5) 0%, rgba(255, 134, 126, 0.1) 40%, transparent 70%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'opacity 0.5s ease-out'
        }}
      >
        ZIG
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Footer Top */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-[15vh] gap-16">
          {/* CTA Section */}
          <div className="flex-1">
            <h2 className="text-[7vw] lg:text-[3.5vw] leading-[1.1] mb-8 font-light">
              Ready to elevate <br />
              your <span className="text-[#FF4532] font-semibold">sound?</span>
            </h2>
            <p className="text-white/60 text-base mb-8 max-w-md">
              Join thousands of listeners who have already discovered ZIG's freedom.
            </p>
            
            {/* Newsletter Box */}
            <form onSubmit={handleSubmit} className="flex items-center bg-white/[0.03] border border-white/5 p-2 rounded-full max-w-[450px] backdrop-blur-xl">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none px-6 py-4 text-white text-base flex-1 outline-none placeholder:text-white/40"
              />
              <button
                type="submit"
                className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm cursor-pointer transition-all duration-300 hover:bg-[#FF4532] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(255,69,50,0.2)] whitespace-nowrap flex-shrink-0"
              >
                Connect
              </button>
            </form>
          </div>

          {/* Nav Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            {/* Navigation Column */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs tracking-[3px] text-white/30 mb-4 font-semibold">
                NAVIGATION
              </h4>
              <Link href="#" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Home
              </Link>
              <Link href="#discover" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Discover
              </Link>
              <Link href="#playlists" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Playlists
              </Link>
              <Link href="#library" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Library
              </Link>
            </div>

            {/* Social Column */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs tracking-[3px] text-white/30 mb-4 font-semibold">
                SOCIAL
              </h4>
              <a href="https://www.youtube.com/watch?v=9g0fv0PHygw" target="_blank" rel="noopener noreferrer" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Youtube
              </a>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-4">
              <h4 className="text-xs tracking-[3px] text-white/30 mb-4 font-semibold">
                LEGAL
              </h4>
              <Link href="/privacy" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Privacy
              </Link>
              <Link href="/terms" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Terms
              </Link>
              <Link href="/cookies" className="text-white/60 text-base hover:text-[#FF4532] hover:translate-x-1 transition-all">
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 opacity-80">
              <img 
                src="/Logo.png" 
                alt="ZIG" 
                className="h-8 w-auto"
                style={{ objectFit: 'contain' }}
              />
              <span className="text-white font-bold text-lg tracking-wide">ZIG</span>
            </div>
            <span className="text-sm text-white/50">
              © 2026 ZIG. All rights reserved.
            </span>
          </div>

          <div className="text-xs tracking-[2px] text-white/40">
            CRAFTED BY <span className="font-semibold">ZIG</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
