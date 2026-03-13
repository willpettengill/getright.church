'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'

export default function AdminIngestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleIngest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        posts: formData.get('posts') ? JSON.parse(formData.get('posts') as string) : [],
        votes: formData.get('votes') ? JSON.parse(formData.get('votes') as string) : [],
      }

      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to ingest data')
      }

      const result = await response.json()
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold font-mono text-text-primary mb-8">Ingest Data</h1>

          <form onSubmit={handleIngest} className="space-y-6">
            <div>
              <label htmlFor="posts" className="block text-sm font-mono text-text-secondary mb-2">
                Posts (JSON)
              </label>
              <textarea
                id="posts"
                name="posts"
                rows={6}
                placeholder='[{"content_text": "...", "source_platform": "twitter", ...}]'
                className="w-full px-4 py-2 bg-bg-secondary border border-neutral-muted rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>

            <div>
              <label htmlFor="votes" className="block text-sm font-mono text-text-secondary mb-2">
                Votes (JSON)
              </label>
              <textarea
                id="votes"
                name="votes"
                rows={6}
                placeholder='[{"politician_id": "...", "bill_name": "...", ...}]'
                className="w-full px-4 py-2 bg-bg-secondary border border-neutral-muted rounded text-text-primary font-mono text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-accent-primary text-white font-mono font-bold rounded hover:bg-accent-dark disabled:opacity-50 transition-colors"
            >
              {loading ? 'Ingesting...' : 'Ingest Data'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-status-negative/10 border border-status-negative rounded text-status-negative text-sm font-mono">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 p-4 bg-status-positive/10 border border-status-positive rounded text-status-positive text-sm font-mono">
              <p>Posts ingested: {result.posts_ingested}</p>
              <p>Votes ingested: {result.votes_ingested}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
