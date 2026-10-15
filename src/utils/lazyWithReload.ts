import { lazy, type ComponentType } from "react";

const KEY = "zh-chunk-reload";

/**
 * React.lazy that survives deploys. After a new build is published, an open tab (or a cached
 * index.html) may ask for a chunk file that no longer exists. Reload once to fetch the new
 * build; if it still fails, let the route's error page handle it.
 */
export function lazyWithReload<T extends ComponentType<unknown>>(load: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      const mod = await load();
      sessionStorage.removeItem(KEY);
      return mod;
    } catch (err) {
      let reloaded = false;
      try { reloaded = sessionStorage.getItem(KEY) === "1"; } catch { /* storage blocked */ }
      if (!reloaded) {
        try { sessionStorage.setItem(KEY, "1"); } catch { /* storage blocked */ }
        window.location.reload();
        return new Promise<never>(() => {}); // keep showing the loader while the page reloads
      }
      throw err;
    }
  });
}
