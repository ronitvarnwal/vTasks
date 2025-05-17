
'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Next.js 14
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Client Interactions</h2>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCount(prev => prev + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Count: {count}
            </button>
          </div>
        </div>

        <div className="p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Image Optimization</h2>
          <Image
            src="/replit.svg"
            alt="Replit Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Routing', 'Layouts', 'Data Fetching'].map((feature) => (
          <div key={feature} className="p-4 border rounded-lg text-center">
            <h3 className="text-xl font-semibold">{feature}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
