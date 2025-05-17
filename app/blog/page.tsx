
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Next.js App',
  description: 'Read our latest blog posts',
}

async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  return res.json()
}

async function getUsers() {
  const res = await fetch('https://jsonplaceholder.typicode.com/users', {
    next: { revalidate: 3600 }
  })
  return res.json()
}

export default async function Blog() {
  const [posts, users] = await Promise.all([getPosts(), getUsers()])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid gap-4">
        {posts.map((post: any) => (
          <article key={post.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
