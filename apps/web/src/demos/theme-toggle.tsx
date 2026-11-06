import { ThemeToggle } from "@weed-ui/theme-toggle";

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <ThemeToggle />
      <span className="font-serif text-sm text-muted-foreground">
        点击切换 dark / light，写入 localStorage，刷新不闪烁。
      </span>
    </div>
  );
}
