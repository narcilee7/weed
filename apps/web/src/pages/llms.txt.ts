import type { APIRoute } from "astro";
import { COMPONENTS } from "../data/components";
import { SITE_ROOT, installCmd, registryTemplate } from "../lib/site";

export const prerender = true;

const SITE = SITE_ROOT;

/**
 * llms.txt —— 给 agent 的索引。
 * 由组件目录生成，改组件不用手改这里。
 */
export const GET: APIRoute = () => {
  const out: string[] = [];

  out.push("# weed · 野草");
  out.push("");
  out.push(
    "> weed-ui is a shadcn/ui registry with a terminal / IDE aesthetic: pixel monospace (Departure Mono) for everything, warm near-black ground, solid slate panels, 1px inset hairlines, blueprint grid, 3px radii. Components ship as copy-paste source code — no npm package, no runtime."
  );
  out.push("");
  out.push(`Docs: ${SITE}/docs`);
  out.push(`Installation: ${SITE}/docs/installation`);
  out.push(`Theming & tokens: ${SITE}/docs/theming`);
  out.push(`Changelog: ${SITE}/changelog (RSS: ${SITE}/changelog.xml)`);
  out.push("");
  out.push("## Plain-text twins");
  out.push("");
  out.push(
    "Every page has a markdown twin. Fetch the `.md` version of any URL on this site."
  );
  out.push("");
  out.push(`- Full documentation: ${SITE}/llms-full.txt`);
  out.push(`- Component catalog: ${SITE}/components.md`);
  out.push(`- Docs index: ${SITE}/docs/index.md`);
  out.push("");
  out.push("## Components");
  out.push("");

  for (const c of COMPONENTS) {
    const also = c.alsoCalled?.length ? ` (also: ${c.alsoCalled.join(", ")})` : "";
    out.push(
      `- ${c.title} [${c.status}]: ${SITE}/docs/components/${c.slug} — ${c.summary}${also}`
    );
  }

  out.push("");
  out.push("## Registry");
  out.push("");
  out.push(
    "Install any component by URL (self-contained: theme css + cn() included):"
  );
  out.push("");
  out.push(`    ${installCmd("button")}`);
  out.push("");
  out.push(
    `Or add the namespace to components.json ("@weed-ui": "${registryTemplate}") and:`
  );
  out.push("");
  out.push("    npx shadcn add @weed-ui/button");
  out.push("");
  out.push(`Registry index (JSON): ${SITE}/r/registry.json`);
  out.push("");

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
