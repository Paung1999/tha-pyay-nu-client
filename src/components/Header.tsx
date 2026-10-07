import {ShoppingCart, Menu, User} from "lucide-react"
import { useApp } from "../providers/AppProvider"
import {Link, useNavigate} from "react-router-dom";
import {useAppSelector} from "../app/hooks.ts";
import {selectCartItemCount} from "../libs/features/cart/cartSlice.ts";
import {selectUser} from "../libs/features/auth/authSlice.ts";
import SearchBar from "./SearchBar.tsx";


export default function Header(){
    const {openDrawer, setOpenDrawer} = useApp()!;
    const navigate = useNavigate();
    const auth = useAppSelector(selectUser);

    const totalItems = useAppSelector(selectCartItemCount)

    return(
        <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 p-3 md:flex-nowrap md:justify-between">
                <div className="order-1 flex items-center gap-2">
                    <button
                        aria-label="Open menu"
                        className="hidden md:block p-2 text-xl text-gray-200 hover:text-gray-300 transition-colors cursor-pointer"
                        onClick={() => setOpenDrawer(!openDrawer)}
                    >
                        <Menu />
                    </button>
                    <Link to="/" className="text-lg sm:text-2xl font-bold text-yellow-500 whitespace-nowrap">
                        ThaPyayNu
                    </Link>

                </div>

                <div className="order-2 ml-auto flex items-center gap-2 md:order-3 md:gap-4">

                    <button
                        onClick={() => navigate("/")}
                        className="hidden md:block text-slate-200 font-mono"
                    >
                        All Book
                    </button>

                    {!auth && (
                        <>
                            <div className="hidden md:flex items-center gap-4">
                                <button
                                    onClick={() => navigate("/sign-in")}
                                    className="relative text-lg font-mono text-white bg-indigo-700 px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors cursor-pointer"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => navigate("/sign-up")}
                                    className="relative p-2 text-lg text-white cursor-pointer underline font-mono"
                                >
                                    Sign Up
                                </button>
                            </div>

                            <button
                                onClick={() => navigate("/sign-in")}
                                aria-label="Sign in"
                                className="md:hidden p-2 text-gray-200 hover:text-gray-300 transition-colors cursor-pointer"
                            >
                                <User />
                            </button>
                        </>
                    )}

                    {auth && auth.role === "ADMIN" && (
                        <button
                            onClick={() => navigate("/admin")}
                            className="relative text-white bg-indigo-700 rounded-md hover:bg-indigo-800 transition-colors cursor-pointer px-3 py-1.5 text-sm md:px-4 md:py-2 md:text-lg"
                        >
                            <span className="md:hidden">Admin</span>
                            <span className="hidden md:inline">Admin Dashboard</span>
                        </button>
                    )}

                    <button
                        onClick={() => navigate("/cart")}
                        aria-label="Cart"
                        className="relative p-2 text-xl text-gray-200 hover:text-gray-300 transition-colors cursor-pointer"
                    >
                        <ShoppingCart />
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {totalItems}
                        </div>
                    </button>
                </div>


                <div className="order-3 flex w-full items-center gap-2 md:order-2 md:w-auto md:flex-1 md:justify-center">
                    <button
                        aria-label="Open menu"
                        className="md:hidden shrink-0 p-2 text-gray-200 hover:text-gray-300 transition-colors cursor-pointer"
                        onClick={() => setOpenDrawer(!openDrawer)}
                    >
                        <Menu />
                    </button>
                    <SearchBar />
                </div>

            </div>
        </header>
    )
}