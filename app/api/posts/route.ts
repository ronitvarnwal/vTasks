
import { NextResponse } from 'next/server'
 
export async function GET() {
  const posts = [
    { id: 1, title: 'First Post', content: 'Hello world!' },
    { id: 2, title: 'Second Post', content: 'Another post' },
  ]
  
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const data = await request.json()
  
  // Handle post creation (demo)
  const newPost = {
    id: 3,
    ...data,
    createdAt: new Date().toISOString()
  }
  
  return NextResponse.json(newPost, { status: 201 })
}
