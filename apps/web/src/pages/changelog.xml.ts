import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { withBase, absolute } from "../lib/site";

export async function GET(context) {
  const entries = await getCollection("changelog");
  return rss({
    title: "weed · changelog",
    description:
      "野草的更新日志：设计语言、组件与站点。Components that grow anywhere.",
    // 站点根（含 base）—— RSS 的 channel link 要带部署路径
    site: new URL(withBase("/"), context.site!),
    items: entries
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((entry) => ({
        title: entry.data.title,
        pubDate: entry.data.date,
        description: entry.body,
        // 绝对 URL —— 相对路径会绕开 base 解析到 origin 根
        link: absolute(`/changelog#${entry.id}`),
      })),
  });
}
