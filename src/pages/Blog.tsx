import { Link, useParams } from "react-router-dom";
import Hero from "../components/Hero";
import PostBody from "../components/PostBody";
import { heroes, pageMeta } from "../data/pages";
import { POSTS_PER_PAGE, posts } from "../data/posts";
import { usePageMeta } from "../utils/meta";
import NotFound from "./NotFound";
import "./pages.css";

/** Blog index. Like the original, each entry shows the full post, 10 per page, with Older/Newer links. */
export default function Blog() {
  const { page } = useParams();
  const n = page ? Number(page) : 1;
  const pages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const path = n === 1 ? "/blog/" : `/blog/page/${n}/`;
  const valid = Number.isInteger(n) && n >= 1 && n <= pages;
  usePageMeta({ title: !valid ? "Page not found | Z Hostel" : n === 1 ? pageMeta.blog.title : `Blog | Page ${n} of ${pages} | Z Hostel`, path });

  if (!valid) return <NotFound />;
  const slice = posts.slice((n - 1) * POSTS_PER_PAGE, n * POSTS_PER_PAGE);

  return (
    <>
      <Hero data={heroes.plain} />
      <main id="content" className="section section--white">
        <div className="container">
          <div className="post-column">
            <h1 className="title-bar">Blog</h1>
            {slice.map((p) => (
              <article key={p.id} className="post-entry">
                <header>
                  <h2 className="post-entry__title"><Link to={`/${p.slug}/`}>{p.title}</Link></h2>
                  <p className="post-entry__date">
                    <time dateTime={p.date}>{new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
                  </p>
                </header>
                <PostBody post={p} />
              </article>
            ))}
            <nav className="post-nav" aria-label="Posts">
              <div>{n < pages && <Link to={`/blog/page/${n + 1}/`}>Older posts</Link>}</div>
              <div className="post-nav__count">Page {n} of {pages}</div>
              <div>{n > 1 && <Link to={n === 2 ? "/blog/" : `/blog/page/${n - 1}/`}>Newer posts</Link>}</div>
            </nav>
          </div>
        </div>
      </main>
    </>
  );
}
