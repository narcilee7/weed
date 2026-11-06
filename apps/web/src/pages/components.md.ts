import type { APIRoute } from "astro";
import { catalogMarkdown } from "../data/markdown";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(catalogMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
