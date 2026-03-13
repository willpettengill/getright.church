import Link from "next/link";

export const metadata = { title: "Check Your Email — Get Right Church" };

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <p className="label-mono mb-4">Almost there</p>
        <h1 className="font-sans text-2xl font-bold text-foreground">Check your email</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We sent you a confirmation link. Click it to activate your account and join the movement.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-block font-mono text-xs text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
