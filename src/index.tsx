import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Local development fallback. The production build is static and does not use this server.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`Static dev server running at ${server.url}`);
