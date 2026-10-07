import {Link, useLocation, useNavigate} from "react-router-dom";
import {Album, ChartBarStacked, LayoutDashboard, LogIn, LogOut, SquareMenu, Store} from "lucide-react";
import {logoutAction, selectUser} from "../libs/features/auth/authSlice.ts";
import {apiSlice} from "../libs/features/api/apiSlice.ts";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {useLogoutMutation} from "../libs/features/auth/authApiSlice.ts";
import {useApp} from "../providers/AppProvider.tsx";

export default function AdminAppDrawer(){
    const {openDrawer, setOpenDrawer} = useApp()!;
    const admin = useAppSelector(selectUser)?.role=='ADMIN';
    const [logoutRequest ] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const navigate = useNavigate();

    if (!openDrawer) return null;
    const handleLogout = async () => {
        try{
            await logoutRequest(undefined).unwrap();
            navigate("/admin/login");
            setOpenDrawer(false);
        }finally{
            dispatch(logoutAction());  // clear Redux user
            dispatch(apiSlice.util.resetApiState());
        }
    };

    return(
        <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col md:flex">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold text-indigo-400 tracking-wider">
                    ThaPyayNu
                </h1>
                <p className="text-xs text-slate-400 mt-1">Admin Control Panel</p>
            </div>
            <nav className="flex-1 p-4 sapce-y-2">
                {admin && (
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
                {!admin &&(
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

            {admin && (
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
    )
}