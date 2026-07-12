import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useAuth from "@/features/auth/hooks/useAuth";

interface PublicNavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export default function PublicNavbar({ isDarkMode, onToggleDarkMode }: PublicNavbarProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { isAuthenticated } = useAuth();

  function renderNavLinks(className?: string) {
    return navLinks.map((link) =>
      isHomePage ? (
        <a
          key={link.href}
          href={link.href}
          className={
            className ??
            "text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          }
        >
          {link.label}
        </a>
      ) : null,
    );
  }

  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="text-primary text-xl font-bold">
          EduElevate
        </Link>

        <nav className="hidden items-center gap-8 md:flex">{renderNavLinks()}</nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>

          <div className="hidden items-center gap-2 sm:flex">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost">
                  <LayoutDashboard className="mr-2 size-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-62.5 sm:w-75">
              <SheetTitle className="text-primary text-left text-lg font-bold">
                EduElevate
              </SheetTitle>
              <nav className="mt-6 flex flex-col gap-4">
                {isHomePage &&
                  navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button variant="outline" className="w-full">
                        <LayoutDashboard className="mr-2 size-4" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="outline" className="w-full">
                          Log In
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
