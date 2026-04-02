"use client"

import { useState } from "react"
import { Search, Upload, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#111111] border-b border-border h-14">
      <div className="flex items-center justify-between h-full px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/Logo.png" 
              alt="ZIG" 
              className="h-8 w-auto"
              style={{ objectFit: 'contain' }}
            />
            <span className="text-xl font-bold text-white hidden sm:block">Zig</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded transition-colors">
              Home
            </Link>
            <Link href="/feed" className="px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors">
              Feed
            </Link>
            <Link href="/library" className="px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded transition-colors">
              Library
            </Link>
          </nav>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-4 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search artists, songs, playlists..."
              className="w-full bg-[#1a1a1a] border border-border rounded-sm pl-10 pr-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hidden sm:flex">
            <Upload className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white hidden sm:flex">
            <Bell className="w-5 h-5" />
          </Button>
          
          <Button className="bg-primary hover:bg-primary/90 text-white text-sm px-4 hidden sm:flex">
            Sign In
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white text-sm px-4 hidden sm:flex">
            Create Account
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-t border-border p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#1a1a1a] border border-border rounded-sm pl-10 pr-4 py-2 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="px-3 py-2 text-sm text-white hover:bg-secondary rounded">
              Home
            </Link>
            <Link href="/feed" className="px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded">
              Feed
            </Link>
            <Link href="/library" className="px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-secondary rounded">
              Library
            </Link>
          </nav>
          <div className="flex gap-2 mt-4">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-white text-sm">
              Sign In
            </Button>
            <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-white text-sm">
              Create Account
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
