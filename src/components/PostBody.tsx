import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../data/types";
import { assetUrl, resolveHtmlAssets } from "../utils/assets";

/** Renders a post's WordPress HTML. Images resolve via the asset origin and lazy-load; internal links use the router. */
export default function PostBody({ post }: { post: Post }) {
  const navigate = useNavigate();
  const html = useMemo(() => {
    let h = resolveHtmlAssets(post.contentHtml);
    h = h.replace(/<img(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"');
    h = h.replace(/<iframe(?![^>]*\bloading=)/g, '<iframe loading="lazy"');
    // Internal links in posts are root-relative ("/slug/"); prefix the deploy base (e.g. /Zhostel-V1/).
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    if (base) h = h.replace(/href="\/(?!\/|wp-content\/)/g, `href="${base}/`);
    return h;
  }, [post.contentHtml]);

  return (
    <div className="entry-content">
      {post.featuredImage && (
        <div className="post-thumb">
          <img
            src={assetUrl(post.featuredImage.src)}
            alt={post.featuredImage.alt}
            width={post.featuredImage.width ?? undefined}
            height={post.featuredImage.height ?? undefined}
            loading="lazy"
          />
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={(e) => {
          const a = (e.target as HTMLElement).closest("a");
          const href = a?.getAttribute("href");
          if (!a || !href || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
          const base = import.meta.env.BASE_URL.replace(/\/$/, "");
          if (href.startsWith("/") && !href.startsWith("//") && !href.includes("/wp-content/")) {
            e.preventDefault();
            navigate(base && href.startsWith(base + "/") ? href.slice(base.length) : href);
          }
        }}
      />
    </div>
  );
}
