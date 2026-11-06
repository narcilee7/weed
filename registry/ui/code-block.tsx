import * as React from "react";

import { cn } from "@/lib/utils";

interface CodeBlockProps extends React.ComponentProps<"pre"> {
  /** 代码内容（children 优先） */
  code?: string;
  /** 终端/窗口标签，如 "app/globals.css" 或 "~/weed" */
  filename?: string;
  /** 右上角语言标签，如 "CSS" */
  language?: string;
  /** 标题栏左侧的提示符，默认无 */
  prompt?: boolean;
}

/**
 * CodeBlock — 终端窗口：标签栏 + copy。窗口标签用 `~/` 前缀更像终端。
 */
function CodeBlock({
  code,
  filename,
  language,
  prompt,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const content = code ?? (typeof children === "string" ? children : undefined);
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(() => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [content]);

  return (
    <figure
      data-slot="code-block"
      className={cn(
        "overflow-hidden rounded-[3px] shadow-[inset_0_0_0_1px_var(--line)]",
        className
      )}
    >
      {(filename || language) && (
        <figcaption className="flex h-7 items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--w-c-chrome)] px-2.5">
          <span className="flex min-w-0 items-center gap-2 font-mono text-[10.5px] text-[var(--w-c-chrome-fg)]">
            {prompt && <span className="text-[var(--w-c-prompt)]">$</span>}
            <span className="truncate">{filename}</span>
          </span>
          <div className="flex items-center gap-3">
            {language && (
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-primary">
                {language}
              </span>
            )}
            <button
              type="button"
              onClick={copy}
              aria-label="Copy code"
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--w-c-chrome-fg)] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {copied ? "copied" : "copy"}
            </button>
          </div>
        </figcaption>
      )}
      <pre
        data-slot="code-block-pre"
        className="overflow-x-auto bg-[var(--w-c-code-bg)] p-3 font-mono text-[12px] leading-relaxed text-[var(--w-c-code-fg)]"
        {...props}
      >
        {content ?? children}
      </pre>
    </figure>
  );
}

export { CodeBlock };
