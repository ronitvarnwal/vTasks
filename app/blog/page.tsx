
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Next.js App',
  description: 'Read our latest blog posts with different rendering strategies',
}

// Static Site Generation (SSG)
async function getStaticPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=2')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

// Server-Side Rendering (SSR)
async function getDynamicPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=2', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

// Incremental Static Regeneration (ISR)
async function getIncrementalPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=2', {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  })
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export default async function Blog() {
  // Parallel data fetching
  const [staticPosts, dynamicPosts, incrementalPosts] = await Promise.all([
    getStaticPosts(),
    getDynamicPosts(),
    getIncrementalPosts()
  ])
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Static Posts (SSG)</h2>
        <div className="grid gap-4">
          {staticPosts.map((post: any) => (
            <article key={post.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="mt-2 text-gray-600">{post.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Dynamic Posts (SSR)</h2>
        <div className="grid gap-4">
          {dynamicPosts.map((post: any) => (
            <article key={post.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="mt-2 text-gray-600">{post.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Incremental Posts (ISR)</h2>
        <div className="grid gap-4">
          {incrementalPosts.map((post: any) => (
            <article key={post.id} className="p-4 border rounded shadow">
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="mt-2 text-gray-600">{post.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
