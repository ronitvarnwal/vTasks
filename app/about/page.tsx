
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Next.js App',
  description: 'Learn more about our company',
}

export default function About() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-700">
        Welcome to our Next.js application. We are demonstrating various Next.js 14 features
        including routing, layouts, and more.
      </p>
    </div>
  )
}
