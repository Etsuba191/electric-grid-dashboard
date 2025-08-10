"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarMenuItem = React.forwardRef<HTMLAnchorElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <li className={cn("w-full", className)} ref={ref} {...props} />
  },
)
SidebarMenuItem.displayName = "SidebarMenuItem"

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
}

const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, isActive, ...props }, ref) => {
    return (
      <button
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-secondary/50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
SidebarMenuButton.displayName = "SidebarMenuButton"

export { SidebarMenuItem, SidebarMenuButton }
