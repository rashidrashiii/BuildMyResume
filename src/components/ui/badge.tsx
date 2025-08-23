import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-primary-foreground shadow-soft hover:shadow-modern hover:bg-primary-600 focus:bg-primary-600",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-soft hover:shadow-modern hover:bg-secondary/80 focus:bg-secondary/80",
        destructive:
          "border-transparent bg-red-500 text-white shadow-soft hover:shadow-modern hover:bg-red-600 focus:bg-red-600",
        outline: "text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
