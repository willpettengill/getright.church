import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-bold font-mono text-accent-primary mb-2">
            Account Created
          </h1>
          <p className="text-text-secondary mb-6">
            Welcome to get-right.church. Check your email to confirm your account.
          </p>
          <p className="text-sm text-text-tertiary font-mono">
            We've sent you a confirmation email. Click the link to verify your address and activate your account.
          </p>
        </div>

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
