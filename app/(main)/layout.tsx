import { Providers } from '@/components/provider'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import '@/styles/global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Built with Next.js 14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          </Providers>
      </body>
    </html>
  )
}