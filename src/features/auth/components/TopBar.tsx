import { useState } from "react";
import { ChevronLeft, Moon, Sun, User, ChevronDown, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useDarkMode from "@/hooks/useDarkMode";
import useAuth from "@/features/auth/hooks/useAuth";

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const userAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}`;

function UserInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export default function TopBar({ sidebarOpen, onToggleSidebar }: TopBarProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function handleLogout() {
    setUserMenuOpen(false);
    logout();
  }

  return (
    <header className="bg-background sticky top-0 z-40 flex h-14 items-center gap-3 border-b px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronLeft
          className={`size-5 transition-transform duration-200 ${sidebarOpen ? "" : "rotate-180"}`}
        />
      </Button>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
        {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>

      <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
        <PopoverTrigger
          render={
            <Button variant="ghost" className="gap-2 pr-3 pl-2">
              {user && (
                <img src={userAvatarUrl(user.id)} alt="" className="bg-muted size-7 rounded-full" />
              )}
              {user && (
                <span className="hidden text-sm font-medium sm:inline">
                  {UserInitials(user.firstName, user.lastName)}
                </span>
              )}
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          }
        />
        <PopoverContent align="end" className="w-64 p-2">
          {user && (
            <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
              <img src={userAvatarUrl(user.id)} alt="" className="bg-muted size-10 rounded-full" />
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-muted-foreground truncate text-xs">{user.email}</p>
              </div>
            </div>
          )}
          <div className="border-t" />
          <Link
            to="/profile"
            onClick={() => setUserMenuOpen(false)}
            className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
          >
            <User className="size-4" />
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="text-destructive hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
          >
            <LogOut className="size-4" />
            Log Out
          </button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
