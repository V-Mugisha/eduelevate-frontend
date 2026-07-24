import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemChild {
  label: string;
  href: string;
}

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  collapsed: boolean;
  disabled?: boolean;
  children?: SidebarItemChild[];
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  collapsed,
  disabled = false,
  children,
}: SidebarItemProps) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(
    children ? children.some((c) => location.pathname.startsWith(c.href)) : false,
  );

  const isGroup = children && children.length > 0;
  const isActive = isGroup
    ? children!.some((c) => location.pathname === c.href)
    : href
      ? location.pathname === href
      : false;

  const itemClassName = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
    isActive && "bg-primary/10 text-primary",
    !isActive && !disabled && "text-muted-foreground hover:bg-muted hover:text-foreground",
    disabled && "cursor-not-allowed text-muted-foreground opacity-50",
    collapsed && "justify-center px-2",
  );

  if (disabled) {
    return (
      <span className={itemClassName} title={collapsed ? label : undefined}>
        <Icon className="size-5 shrink-0" />
        {!collapsed && <span className="truncate">{label}</span>}
      </span>
    );
  }

  if (isGroup) {
    return (
      <div>
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className={itemClassName}
          title={collapsed ? label : undefined}
        >
          <Icon className="size-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left">{label}</span>
              {expanded ? (
                <ChevronDown className="size-4 shrink-0" />
              ) : (
                <ChevronRight className="size-4 shrink-0" />
              )}
            </>
          )}
        </button>
        {!collapsed && expanded && (
          <div className="ml-5 space-y-0.5 border-l pl-2">
            {children!.map((child) => {
              const childActive = location.pathname === child.href;
              return (
                <Link
                  key={child.href}
                  to={child.href}
                  className={cn(
                    "block w-full rounded px-2 py-1 text-left text-sm",
                    childActive
                      ? "bg-primary/5 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {child.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link to={href!} className={itemClassName} title={collapsed ? label : undefined}>
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
