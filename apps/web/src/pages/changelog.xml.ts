import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const entries = await getCollection("changelog");
  return rss({
    title: "weed · changelog",
    description:
      "野草的更新日志：设计语言、组件与站点。Components that grow anywhere.",
    site: context.site,
    items: entries
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((entry) => ({
        title: entry.data.title,
        pubDate: entry.data.date,
        description: entry.body,
        link: `/changelog#${entry.id}`,
      })),
  });
}
