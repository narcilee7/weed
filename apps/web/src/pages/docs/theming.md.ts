import type { APIRoute } from "astro";
import { themingMarkdown } from "../../data/markdown";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(themingMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
