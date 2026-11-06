import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[3px] font-mono text-[11px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95",
        outline:
          "bg-panel text-foreground shadow-[inset_0_0_0_1px_var(--w-c-button-line)] hover:bg-panel-soft hover:shadow-[inset_0_0_0_1px_var(--foreground)]",
        ghost:
          "text-muted-foreground hover:bg-panel-soft hover:text-foreground",
        subtle:
          "bg-panel-soft text-muted-foreground hover:text-foreground hover:bg-panel",
      },
      size: {
        sm: "h-6 px-2",
        default: "h-7 px-3",
        lg: "h-9 px-5 text-xs",
        icon: "size-7",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
