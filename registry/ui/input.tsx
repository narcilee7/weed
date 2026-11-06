import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-7 w-full min-w-0 rounded-[3px] bg-[var(--w-c-input-bg)] px-2.5 font-mono text-[12px] text-foreground transition-[box-shadow] outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-40",
        "shadow-[inset_0_0_0_1px_var(--w-c-input-line)] focus:shadow-[inset_0_0_0_1px_var(--w-c-input-line-focus),0_0_0_2px_color-mix(in_oklab,var(--ring)_22%,transparent)]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
