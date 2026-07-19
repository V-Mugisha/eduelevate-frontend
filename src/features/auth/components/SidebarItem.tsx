import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  collapsed: boolean;
  disabled?: boolean;
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  collapsed,
  disabled = false,
}: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === href;

  const content = (
    <>
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </>
  );

  const className = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive && "bg-primary/10 text-primary",
    !isActive && !disabled && "text-muted-foreground hover:bg-muted hover:text-foreground",
    disabled && "cursor-not-allowed text-muted-foreground opacity-50",
    collapsed && "justify-center px-2",
  );

  if (disabled) {
    return (
      <span className={className} title={collapsed ? label : undefined}>
        {content}
      </span>
    );
  }

  return (
    <Link to={href} className={className} title={collapsed ? label : undefined}>
      {content}
    </Link>
  );
}
