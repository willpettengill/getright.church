'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState, useEffect } from 'react'

export default function AdminPortraitsPage() {
  const [politicians, setPoliticians] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    // Fetch politicians from API or database
    setLoading(true)
    // This would be connected to the API in a full implementation
    setLoading(false)
  }, [])

  async function handleGeneratePortrait(politicianId: string) {
    setLoading(true)
    try {
      // This would call OpenAI or another image generation service
      // For now, it's a placeholder
      const response = await fetch(`/api/portraits/${politicianId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portrait_url: 'https://via.placeholder.com/300x400',
          portrait_style: 'pixar',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate portrait')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold font-mono text-text-primary mb-8">Generate Portraits</h1>

          <div className="card">
            <p className="text-text-secondary font-mono mb-4">
              Generate AI portraits using DALL-E 3. Select a politician and click Generate.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-text-tertiary">
                Portrait generation is configured but requires API setup. Connect your OpenAI API key to enable portrait generation.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
