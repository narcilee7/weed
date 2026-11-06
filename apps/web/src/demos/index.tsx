import type { ComponentType } from "react";

import BadgeDemo from "./badge";
import BlueprintGridDemo from "./blueprint-grid";
import ButtonDemo from "./button";
import CardDemo from "./card";
import CodeBlockDemo from "./code-block";
import DialogDemo from "./dialog";
import InputDemo from "./input";
import TableDemo from "./table";
import TabsDemo from "./tabs";
import ThemeToggleDemo from "./theme-toggle";
import TooltipDemo from "./tooltip";

/**
 * DemoHost — 一个岛，按 slug 分发到对应 demo。
 * Astro 的 client:* 指令要求组件静态可分析，所以这里用静态 import 的
 * map，而不是 import.meta.glob 的动态引用。
 */
const DEMOS: Record<string, ComponentType> = {
  badge: BadgeDemo,
  "blueprint-grid": BlueprintGridDemo,
  button: ButtonDemo,
  card: CardDemo,
  "code-block": CodeBlockDemo,
  dialog: DialogDemo,
  input: InputDemo,
  table: TableDemo,
  tabs: TabsDemo,
  "theme-toggle": ThemeToggleDemo,
  tooltip: TooltipDemo,
};

export default function DemoHost({ slug }: { slug: string }) {
  const Demo = DEMOS[slug];
  if (!Demo) return null;
  return <Demo />;
}
