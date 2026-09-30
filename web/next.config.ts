import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Photographs uploaded in the Sanity Studio are served from Sanity's CDN.
       The object form, not `new URL(...)`: a URL pattern pins the query string
       to empty, and a cropped image's URL carries `?rect=…`. */
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
  },
  experimental: {
    /* `app/global-not-found.tsx` — the 404 for URLs that match no route. The
       root layout is bare (the Studio shares it), so a root not-found would
       have to carry the site shell into every page's payload. See the note in
       that file. */
    globalNotFound: true,
  },
};

export default nextConfig;
