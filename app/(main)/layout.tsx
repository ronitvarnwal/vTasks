import { Providers } from '@/components/provider'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'
import '@/styles/global.css'

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
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          </Providers>
      </body>
    </html>
  )
}
