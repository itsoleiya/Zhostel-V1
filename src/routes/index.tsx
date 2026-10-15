import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../layouts/SiteLayout";
import Home from "../pages/Home";
import About from "../pages/About";
import Rooms from "../pages/Rooms";
import Events from "../pages/Events";
import Gallery from "../pages/Gallery";
import Contact from "../pages/Contact";
import { Suspense } from "react";
import { lazyWithReload } from "../utils/lazyWithReload";
import RouteError from "../pages/RouteError";

// The blog carries all 92 posts (~600 KB), so it loads only when visited.
const Blog = lazyWithReload(() => import("../pages/Blog"));
const Post = lazyWithReload(() => import("../pages/Post"));
const wrap = (el: React.ReactNode) => <Suspense fallback={<div className="route-loading" role="status">Loading…</div>}>{el}</Suspense>;
import NotFound from "../pages/NotFound";

/** URLs match the WordPress site, so existing links and search results keep working. */
export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    errorElement: <RouteError />,
    children: [
      {
        // Errors inside a page render here, keeping the header, menu and footer.
        errorElement: <RouteError />,
        children: [
      { path: "/", element: <Home /> },
      { path: "/about-z", element: <About /> },
      { path: "/rooms-and-services", element: <Rooms /> },
      { path: "/events-and-activities", element: <Events /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/contact-us", element: <Contact /> },
      { path: "/blog", element: wrap(<Blog />) },
      { path: "/blog/page/:page", element: wrap(<Blog />) },
      { path: "/:slug", element: wrap(<Post />) },
      { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
], { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });
