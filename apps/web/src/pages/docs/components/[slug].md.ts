import type { APIRoute, GetStaticPaths } from "astro";
import { COMPONENTS } from "../../../data/components";
import { componentMarkdown } from "../../../data/markdown";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () =>
  COMPONENTS.map((c) => ({
    params: { slug: c.slug },
    props: { doc: c },
  }));

export const GET: APIRoute = ({ props }) => {
  const doc = props.doc as (typeof COMPONENTS)[number];
  return new Response(componentMarkdown(doc), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
