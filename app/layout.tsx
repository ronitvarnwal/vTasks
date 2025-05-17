
import type { Metadata } from 'next'
import { Inter, Roboto_Mono } from 'next/font/google'
import '../styles/global.css'

const inter = Inter({ subsets: ['latin'] })
const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})

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
        <div>
          {children}
        </div>
      </body>
    </html>
  )
}
