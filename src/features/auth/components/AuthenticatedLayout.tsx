import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AuthenticatedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  function handleToggleSidebar() {
    setSidebarOpen((previous) => !previous);
  }

  function handleOpenMobileSheet() {
    setMobileSheetOpen(true);
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <div className="hidden md:block">
        <Sidebar variant="desktop" collapsed={!sidebarOpen} onToggle={handleToggleSidebar} />
      </div>

      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="left" className="w-60 p-0">
          <Sidebar variant="sheet" collapsed={false} onToggle={() => setMobileSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-200 ${
          sidebarOpen ? "md:ml-60" : "md:ml-16"
        }`}
      >
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          onOpenMobileSheet={handleOpenMobileSheet}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
