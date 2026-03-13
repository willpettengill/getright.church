import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${new URL(request.url).origin}/auth/sign-up-success`,
    },
  });

  if (error) {
    redirect("/auth/sign-up?error=" + encodeURIComponent(error.message));
  }

  redirect("/auth/sign-up-success");
}
