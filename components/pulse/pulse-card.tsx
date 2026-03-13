import { cn, platformIcon, sentimentColor, formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface PulseCardProps {
  post: Post;
}

export function PulseCard({ post }: PulseCardProps) {
  const score = post.sentiment_score ?? 0;

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 rounded-md border bg-card p-4 transition-colors hover:border-border/80",
        score >= 40 && "border-l-2 border-l-endorsed border-border",
        score <= -40 && "border-l-2 border-l-anti-endorsed border-border",
        score > -40 && score < 40 && "border-border"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-secondary font-mono text-[10px] font-bold text-muted-foreground">
            {platformIcon(post.source_platform)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {post.source_platform}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-[10px]", sentimentColor(score))}>
            {score > 0 ? "+" : ""}{Math.round(score)}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/50">
            {formatDate(post.created_at)}
          </span>
        </div>
      </div>

      {/* Content */}
      {post.content_text && (
        <p className="text-sm text-foreground/90 leading-relaxed">
          {post.content_text}
        </p>
      )}

      {/* Embed */}
      {post.content_embed_html && (
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: post.content_embed_html }}
        />
      )}

      {/* Footer */}
      {post.source_url && (
        <a
          href={post.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50 hover:text-primary transition-colors self-start"
        >
          <ExternalLink size={10} />
          View source
        </a>
      )}
    </article>
  );
}
