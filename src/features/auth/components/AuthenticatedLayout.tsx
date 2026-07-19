import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AuthenticatedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  function handleToggleSidebar() {
    setSidebarOpen((previous) => !previous);
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block">
        <Sidebar collapsed={!sidebarOpen} onToggle={handleToggleSidebar} />
      </div>

      <div
        className={`flex flex-1 flex-col transition-all duration-200 ${
          sidebarOpen ? "md:ml-60" : "md:ml-16"
        }`}
      >
        <TopBar sidebarOpen={sidebarOpen} onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
