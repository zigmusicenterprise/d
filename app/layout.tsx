import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import './globals.css'

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-poppins'
});

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'ZIG - No Limits, Just Music',
  description: 'The first 100% free app to listen to music in real-time with your friends. No limits, no ads.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/Logo.png',
        type: 'image/png',
      },
    ],
    apple: '/Logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#FF4532',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
