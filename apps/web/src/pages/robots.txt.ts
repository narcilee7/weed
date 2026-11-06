import type { APIRoute } from "astro";
import { SITE_ROOT } from "../lib/site";

export const prerender = true;

/** robots.txt —— 从 site.json 推导 sitemap 地址，不会跟部署地址漂移 */
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${SITE_ROOT}/sitemap-index.xml
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } }
  );
