
export const metadata = {
  title: 'Contact - Next.js App',
  description: 'Contact us page with server actions',
}

async function submitForm(formData: FormData) {
  'use server'
  
  const email = formData.get('email')
  const message = formData.get('message')
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('Form submitted:', { email, message })
  // Here you would typically send to an API or database
}

export default function Contact() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form action={submitForm} className="max-w-md space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
