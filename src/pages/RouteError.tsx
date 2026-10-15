import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import "./pages.css";

/** Shown instead of React Router's raw "Unexpected Application Error" screen. */
export default function RouteError() {
  const error = useRouteError();
  const isChunk = error instanceof Error && /dynamically imported module|Importing a module script failed|Loading chunk/i.test(error.message);
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <main className="not-found on-dark" style={{ paddingBottom: 100 }}>
      <div className="container text-center">
        <h1 className="title-bar">{notFound ? "404" : "Something went wrong"}</h1>
        <p>
          {isChunk
            ? "The website was just updated and this page needs to reload to get the new version."
            : notFound
              ? "This page isn’t here. It may have moved when the site was rebuilt."
              : "This page couldn’t load. Reload to try again."}
        </p>
        <p>
          <button type="button" className="btn-outline" onClick={() => window.location.reload()}>Reload page</button>
          <Link className="btn-outline" to="/">Go to the homepage</Link>
        </p>
        {!isChunk && !notFound && error instanceof Error && (
          <p style={{ fontSize: 12, opacity: 0.6 }}>Error details: {error.message}</p>
        )}
      </div>
    </main>
  );
}
