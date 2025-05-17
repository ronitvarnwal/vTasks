
import type { Metadata } from 'next'
import '../styles/global.css'

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
        <div>
          {children}
        </div>
      </body>
    </html>
  )
}
