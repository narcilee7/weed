import type { APIRoute } from "astro";
import { llmsFullMarkdown } from "../data/markdown";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(llmsFullMarkdown(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
