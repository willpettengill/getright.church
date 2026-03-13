import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold font-mono text-status-negative mb-4">
          Authentication Error
        </h1>
        <p className="text-text-secondary mb-8">
          There was an issue signing you in. Please try again or contact support.
        </p>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-3 bg-accent-primary text-white font-mono font-bold rounded hover:bg-accent-dark transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}
