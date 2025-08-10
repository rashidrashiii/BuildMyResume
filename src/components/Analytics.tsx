import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Lightweight conditional Umami loader and manual pageview tracker
// - Disables auto tracking
// - Skips tracking for published resume view routes (/view/:id)
// - Skips tracking for editor routes with an ID (/editor/:id) but tracks base /editor
// - Defers loading to keep initial render fast

const UMAMI_SRC = import.meta.env.VITE_UMAMI_SRC;
const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;

function isPublishedResumePath(pathname: string): boolean {
  // Match `/view/:id` (simple check to avoid dependency on route params here)
  return /^\/view\//.test(pathname);
}

function isEditorWithIdPath(pathname: string): boolean {
  // Match `/editor/:id` but not the base `/editor`
  return /^\/editor\//.test(pathname) && pathname !== "/editor";
}

export function Analytics() {
  const location = useLocation();
  const hasLoadedRef = useRef(false);

  // Inject Umami script with auto-track disabled
  useEffect(() => {
    if (typeof window === "undefined" || hasLoadedRef.current) return;

    // If env values are not provided, do nothing
    if (!UMAMI_SRC || !UMAMI_WEBSITE_ID) {
      hasLoadedRef.current = true;
      return;
    }

    // Avoid injecting twice
    if (document.querySelector('script[data-umami-custom-loader="true"]')) {
      hasLoadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = UMAMI_SRC as string;
    script.setAttribute("data-website-id", UMAMI_WEBSITE_ID as string);
    script.setAttribute("data-auto-track", "false");
    script.setAttribute("data-umami-custom-loader", "true");

    document.head.appendChild(script);
    hasLoadedRef.current = true;
  }, []);

  // Manually track route changes except published resume paths and editor/:id
  useEffect(() => {
    const { pathname } = location;

    // If env values are not provided, or this is an excluded path, skip tracking
    if (!UMAMI_SRC || !UMAMI_WEBSITE_ID || isPublishedResumePath(pathname) || isEditorWithIdPath(pathname)) return;

    // Umami exposes a global `umami` function when ready
    const track = () => {
      try {
        // @ts-expect-error umami global injected by script
        if (typeof window !== "undefined" && typeof window.umami?.track === "function") {
          // Capture path only (no hash, no query)
          // @ts-expect-error umami global injected by script
          window.umami.track("pageview", { url: pathname });
        }
      } catch {
        // no-op: fail silently to avoid impacting UX
      }
    };

    // If script may not be ready yet, schedule microtask
    const id = window.setTimeout(track, 0);
    return () => window.clearTimeout(id);
  }, [location]);

  return null;
}

export default Analytics;
