import type { APIRoute } from "astro";
import { overviewMarkdown } from "../data/markdown";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(overviewMarkdown(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
