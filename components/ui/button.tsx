import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-white text-black hover:bg-white/90",
                destructive: "bg-white/10 text-red-400 border border-red-400/50 hover:bg-red-400/10",
                outline: "border border-white/20 bg-transparent hover:bg-white/5",
                secondary: "bg-white/10 text-white hover:bg-white/20",
                ghost: "hover:bg-white/10",
                link: "text-white underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-5 rounded-full",
                sm: "h-8 px-4 text-xs rounded-full",
                lg: "h-12 px-8 rounded-full",
                icon: "h-10 w-10 rounded-full",
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
