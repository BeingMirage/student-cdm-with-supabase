"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const CollapsibleContext = React.createContext<{
       open: boolean
       onOpenChange: (open: boolean) => void
} | null>(null)

const Collapsible = ({
       open,
       children,
       onOpenChange,
       className,
       ...props
}: {
       open?: boolean
       children?: React.ReactNode
       onOpenChange?: (open: boolean) => void
       className?: string
} & React.HTMLAttributes<HTMLDivElement>) => {
       const [isOpen, setIsOpen] = React.useState(open ?? false)

       React.useEffect(() => {
              if (open !== undefined) {
                     setIsOpen(open)
              }
       }, [open])

       const handleOpenChange = React.useCallback(
              (newOpen: boolean) => {
                     setIsOpen(newOpen)
                     onOpenChange?.(newOpen)
              },
              [onOpenChange]
       )

       return (
              <CollapsibleContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
                     <div className={cn("collapsible", className)} {...props}>
                            {children}
                     </div>
              </CollapsibleContext.Provider>
       )
}

const CollapsibleTrigger = React.forwardRef<
       HTMLButtonElement,
       React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
       const context = React.useContext(CollapsibleContext)
       if (!context) throw new Error("CollapsibleTrigger must be used within Collapsible")

       return (
              <button
                     ref={ref}
                     className={cn("flex w-full items-center justify-between", className)}
                     onClick={() => context.onOpenChange(!context.open)}
                     type="button"
                     {...props}
              >
                     {children}
              </button>
       )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
       HTMLDivElement,
       React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
       const context = React.useContext(CollapsibleContext)
       if (!context) throw new Error("CollapsibleContent must be used within Collapsible")

       return (
              <div
                     ref={ref}
                     data-state={context.open ? "open" : "closed"}
                     className={cn(
                            "grid transition-all duration-300 ease-in-out data-[state=closed]:grid-rows-[0fr] data-[state=open]:grid-rows-[1fr]",
                            className
                     )}
                     {...props}
              >
                     <div className="overflow-hidden">
                            {children}
                     </div>
              </div>
       )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
