import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getBills } from '@/lib/api'
import { BillsList } from '@/components/bills-list'

export const metadata = {
  title: 'Bills | get-right.church',
  description: 'Browse legislation and party voting positions',
}

export default async function BillsPage() {
  const bills = await getBills(undefined, undefined, 50)

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>
        {/* Page header */}
        <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: '3rem 0 2.5rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.25rem' }}>
            <p className="section-label" style={{ marginBottom: '0.75rem' }}>Legislation</p>
            <h1 style={{ fontFamily: 'var(--font-display), "Bebas Neue", sans-serif', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '0.04em', color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.75rem' }}>
              Bills
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', letterSpacing: '0.02em' }}>
              {bills.length} bills tracked across 118th–119th Congress
            </p>
          </div>
        </div>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.25rem' }}>
          <BillsList bills={bills} />
        </div>
      </main>
      <Footer />
    </>
  )
}
