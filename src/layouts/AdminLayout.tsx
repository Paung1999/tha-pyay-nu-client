import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../providers/AppProvider";
import {
  LayoutDashboard,
  LogOut,
  Store,
  Album,
  ChartBarStacked,
  LogIn,
  SquareMenu
} from "lucide-react";

export default function AdminLayout() {
  const { adminAuth, setAdminAuth } = useApp()!;
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("token");
    setAdminAuth(null);
    navigate("/admin");
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col md:flex">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-indigo-400 tracking-wider">
            ThaPyayNu
          </h1>
          <p className="text-xs text-slate-400 mt-1">Admin Control Panel</p>
        </div>
        <nav className="flex-1 p-4 sapce-y-2">
          {adminAuth && (
            <div>
              <Link
                to={"/admin"}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors hover:bg-slate-900 hover:text-white ${isActive("/admin") && "bg-slate-700 text-white"}`}
              >
                <LayoutDashboard />
                <span className="ml-2">Dashboard</span>
              </Link>
              <Link
                to={"/admin/orders"}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors hover:bg-slate-900 hover:text-white ${isActive("/admin/orders") && "bg-slate-700 text-white"}`}
                
              >
                <SquareMenu/>
                <span className="ml-2">Orders</span>

              </Link>
              <Link
                to={"/admin/inventory"}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors hover:bg-slate-900 hover:text-white ${isActive("/admin/inventory") && "bg-slate-700 text-white"}`}
              >
                <Album />
                <span className="ml-2">Inventory</span>
              </Link>
              <Link
                to={"/admin/listings"}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors hover:bg-slate-900 hover:text-white ${isActive("/admin/listings") && "bg-slate-700 text-white"}`}
              >
                <Store />
                <span className="ml-2">Store</span>
              </Link>
              <Link
                to={"/admin/genres"}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors hover:bg-slate-900 hover:text-white ${isActive("/admin/genres") && "bg-slate-700 text-white"}`}
              >
                <ChartBarStacked />
                <span className="ml-2">Genres</span>
              </Link>
            </div>
          )}
          {!adminAuth &&(
            <div>
                <Link
                to={"/admin/login"}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors hover:bg-slate-900 hover:text-white ${isActive("/admin") && "bg-slate-700 text-white"}`}
              >
                <LogIn />
                <span className="ml-2">Sign In</span>
              </Link>
            </div>
          )}
        </nav>

        {adminAuth && (
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors cursor-pointer"
            >
              <LogOut size={20} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-900 p-8">
        <Outlet />
      </main>
    </div>
  );
}
