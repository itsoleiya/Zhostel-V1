import { Link, useParams } from "react-router-dom";
import Hero from "../components/Hero";
import PostBody from "../components/PostBody";
import { heroes } from "../data/pages";
import { postBySlug, posts } from "../data/posts";
import { assetUrl } from "../utils/assets";
import { usePageMeta } from "../utils/meta";
import NotFound from "./NotFound";
import "./pages.css";

export default function Post() {
  const { slug = "" } = useParams();
  const post = postBySlug.get(slug);
  const index = post ? posts.indexOf(post) : -1;
  usePageMeta({
    title: post ? `${post.title} | Z Hostel` : "Page not found | Z Hostel",
    description: post?.excerpt.slice(0, 160) || null,
    path: `/${slug}/`,
    image: post?.featuredImage ? assetUrl(post.featuredImage.src) : undefined,
  });
  if (!post) return <NotFound />;
  const prev = posts[index + 1]; // older
  const next = posts[index - 1]; // newer

  return (
    <>
      <Hero data={heroes.plain} />
      <main id="content" className="section section--white">
        <div className="container">
          <article className="post-column post-entry">
            <header>
              <h1 className="post-entry__title post-entry__title--single">{post.title}</h1>
              <p className="post-entry__date">
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>
              </p>
            </header>
            <PostBody post={post} />
            <nav className="post-nav post-nav--single" aria-label="Post navigation">
              <div>{prev && <Link to={`/${prev.slug}/`} rel="prev"><span>Previous</span>{prev.title}</Link>}</div>
              <div>{next && <Link to={`/${next.slug}/`} rel="next"><span>Next</span>{next.title}</Link>}</div>
            </nav>
          </article>
        </div>
      </main>
    </>
  );
}
