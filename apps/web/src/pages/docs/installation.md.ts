import type { APIRoute } from "astro";
import { installationMarkdown } from "../../data/markdown";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(installationMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
