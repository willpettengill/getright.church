import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Users,
  FileText,
  Rss,
  LayoutDashboard,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/politicians", label: "Politicians", icon: Users },
  { href: "/admin/posts", label: "Posts", icon: Rss },
  { href: "/admin/comments", label: "Comments", icon: FileText },
  { href: "/admin/portraits", label: "Portraits", icon: ImageIcon },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role, username")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") redirect("/");

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-14 bottom-0 w-48 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <p className="label-mono">Admin</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground truncate">
            @{profile.username ?? user.email}
          </p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1" aria-label="Admin navigation">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded px-3 py-2 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <form action="/auth/sign-out" method="POST">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded px-3 py-2 font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-48 flex-1 p-8">{children}</div>
    </div>
  );
}
