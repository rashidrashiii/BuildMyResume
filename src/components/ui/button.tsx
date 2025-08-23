import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary-500 text-primary-foreground shadow-button hover:shadow-button-hover hover:bg-primary-600 focus:bg-primary-600",
        destructive:
          "bg-red-500 text-white shadow-button hover:shadow-button-hover hover:bg-red-600 focus:bg-red-600",
        outline:
          "border-2 border-border bg-background text-foreground shadow-soft hover:shadow-modern hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:shadow-modern hover:bg-secondary/80 focus:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground shadow-soft hover:shadow-modern focus:bg-accent focus:text-accent-foreground",
        link: "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 focus:text-primary-700 shadow-none hover:shadow-none",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 py-2 text-xs",
        lg: "h-14 rounded-xl px-8 py-4 text-base",
        xl: "h-16 rounded-xl px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
