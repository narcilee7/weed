import * as React from "react";

import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

const STORAGE_KEY = "weed-theme";

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode */
  }
}

/**
 * 主题切换。约定：`<html data-theme="dark|light">` 驱动全部 token，
 * 消费方需在 `<head>` 内联无闪烁 bootstrap（见 docs）。
 */
function ThemeToggle({ className, ...props }: React.ComponentProps<"button">) {
  const [theme, setThemeState] = React.useState<Theme>("dark");

  React.useEffect(() => {
    setThemeState(getTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <button
      type="button"
      data-slot="theme-toggle"
      aria-label="Toggle theme"
      onClick={toggle}
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-[3px] bg-[var(--panel-soft)] px-2 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      <span aria-hidden className={theme === "dark" ? "text-wheat" : "text-ochre"}>
        {theme === "dark" ? "◐" : "◑"}
      </span>
      {theme}
    </button>
  );
}

export { ThemeToggle };
