import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 rounded-[2px] px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.08em] whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline:
          "bg-transparent text-muted-foreground shadow-[inset_0_0_0_1px_var(--w-c-badge-line)]",
        muted: "bg-[var(--panel-soft)] text-muted-foreground",
        ochre: "bg-transparent text-ochre shadow-[inset_0_0_0_1px_var(--ochre)]",
        sage: "bg-transparent text-sage shadow-[inset_0_0_0_1px_var(--sage)]",
        wheat: "bg-transparent text-wheat shadow-[inset_0_0_0_1px_var(--wheat)]",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
