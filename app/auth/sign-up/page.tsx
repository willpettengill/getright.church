export const metadata = { title: "Sign Up — Get Right Church" };

export default function SignUpPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="label-mono mb-2">Join</p>
          <h1 className="font-sans text-2xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Become part of the movement.</p>
        </div>

        <form action="/auth/sign-up/action" method="POST" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="username" className="label-mono">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="yourhandle"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="label-mono">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="label-mono">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Min. 8 characters"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
