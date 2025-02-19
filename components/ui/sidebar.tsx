import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: boolean | "icon"
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsible, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group/sidebar relative flex flex-col",
          collapsible === "icon" && "w-[var(--sidebar-width)]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex h-[var(--header-height)] items-center", className)} {...props} />
  ),
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex-1 overflow-auto", className)} {...props} />,
)
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("mt-auto", className)} {...props} />,
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute right-0 top-0 h-full w-[1px] bg-border opacity-50", className)} {...props} />
  ),
)
SidebarRail.displayName = "SidebarRail"

export { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail }

