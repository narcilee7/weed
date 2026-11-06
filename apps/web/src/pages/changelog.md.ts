import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
  const entries = (await getCollection("changelog")).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const out = ["# 更新日志", ""];
  for (const entry of entries) {
    const body = entry.body ?? "";
    out.push(`## ${entry.data.title}`);
    out.push("");
    out.push(`**${entry.data.date.toISOString().slice(0, 10)}**`);
    out.push("");
    out.push(body.trim());
    out.push("");
  }
  out.push("订阅源：https://weedui.dev/changelog.xml");
  out.push("");

  return new Response(out.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
