import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "Sign In — Get Right Church" };

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="label-mono mb-2">Access</p>
          <h1 className="font-sans text-2xl font-bold text-foreground">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">Admin and member access only.</p>
        </div>

        <form action="/auth/login/action" method="POST" className="flex flex-col gap-4">
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
              autoComplete="current-password"
              className="rounded border border-border bg-secondary px-3 py-2 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 rounded bg-primary px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center font-mono text-[10px] text-muted-foreground">
          No account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
