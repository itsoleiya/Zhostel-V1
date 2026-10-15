import raw from "./posts.json";
import type { Post } from "./types";

/** All 92 published posts, newest first. Regenerate with `npm run import:posts`. */
export const posts = raw as Post[];
export const POSTS_PER_PAGE = 10;
export const postBySlug = new Map(posts.map((p) => [p.slug, p]));
