import { Link } from "react-router-dom";
import { usePageMeta } from "../utils/meta";
import "./pages.css";

export default function NotFound() {
  usePageMeta({ title: "Page not found | Z Hostel", path: window.location.pathname });
  return (
    <main id="content" className="not-found on-dark">
      <div className="container text-center">
        <h1 className="title-bar">404</h1>
        <p>This page isn’t here. It may have moved when the site was rebuilt.</p>
        <p>
          <Link className="btn-outline" to="/">Go to the homepage</Link>
          <Link className="btn-outline" to="/blog/">Browse the blog</Link>
        </p>
      </div>
    </main>
  );
}
