import { Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, Code, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/features/auth/hooks/useAuth";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const studentItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Code, label: "Exercises", href: "/exercises", disabled: true },
];

const educatorItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Code, label: "Review Submissions", href: "/exercises", disabled: true },
];

const adminItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Courses", href: "/courses" },
  { icon: Users, label: "User Management", href: "/users", disabled: true },
  { icon: Settings, label: "Settings", href: "/settings", disabled: true },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();

  const role = user?.role ?? "student";
  const items = role === "admin" ? adminItems : role === "educator" ? educatorItems : studentItems;

  return (
    <aside
      className={`bg-background fixed top-0 left-0 z-50 flex h-screen flex-col border-r transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link
          to="/dashboard"
          className={`text-primary flex items-center gap-2 font-bold ${
            collapsed ? "justify-center" : ""
          }`}
        >
          {collapsed ? (
            <span className="text-lg">EE</span>
          ) : (
            <span className="text-lg">EduElevate</span>
          )}
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            collapsed={collapsed}
            disabled={item.disabled}
          />
        ))}
      </nav>

      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-full justify-start gap-3 text-xs"
          onClick={onToggle}
        >
          <ChevronDoubleIcon collapsed={collapsed} />
          {!collapsed && <span>{collapsed ? "Expand" : "Collapse"}</span>}
        </Button>
      </div>
    </aside>
  );
}

function ChevronDoubleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      className={`size-4 shrink-0 transition-transform ${collapsed ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
      />
    </svg>
  );
}
