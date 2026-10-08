import {  Outlet } from "react-router-dom";
import AdminAppDrawer from "../components/AdminAppDrawer.tsx";
import {Bell, Menu} from "lucide-react";
import {useApp} from "../providers/AppProvider.tsx";

export default function AdminLayout() {
    const {openDrawer, setOpenDrawer} = useApp()!;


  return (
      <div className="flex h-screen flex-col overflow-hidden bg-slate-900 text-white">

          <header className="z-40 flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                  <button
                      aria-label="Toggle menu"
                      onClick={() => setOpenDrawer(!openDrawer)}
                      className="p-1 text-slate-200 transition-colors hover:text-white cursor-pointer"
                  >
                      <Menu />
                  </button>
                  <span className="font-semibold">Admin Dashboard</span>
              </div>

              <button aria-label="Notifications" className="p-1 text-slate-200 transition-colors hover:text-white cursor-pointer">
                  <Bell />
              </button>
          </header>

          <div className="flex flex-row flex-1 overflow-hidden">
              <AdminAppDrawer />

              <main className="min-w-0 flex-1 overflow-y-auto bg-slate-900 p-4 sm:p-6 lg:p-8">
                  <Outlet />
              </main>
          </div>
      </div>
  );
}
