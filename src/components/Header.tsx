import { ShoppingCart, Menu, Home } from "lucide-react"
import { useApp } from "../providers/AppProvider"
import { useNavigate } from "react-router-dom";
import { useCart } from "../providers/CartProvider";
import SearchBar from "../pages/SearchBar";


export default function Header(){
    const {openDrawer, setOpenDrawer, auth} = useApp()!;
    const navigate = useNavigate();
    const { items } = useCart();

    const totalItems = items.reduce((total, item)=> total + item.quantity,0);


    return(
        <header className="flex flex-row items-center justify-between p-3 sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md ">
            <div 
            className="flex flex-row items-center gap-2">
                <button className="p-2 text-xl text-gray-200 dark:text-gray-200  hover:text-gray-200 dark:hover:text-gray-300 transition-colors cursor-pointer"
                    onClick={()=>setOpenDrawer(!openDrawer)}
                >
                    <Menu />
                </button>
                <h1 className="text-2xl font-bold text-yellow-500 cursor-pointer " onClick={()=>navigate('/')}>ThaPyayNu</h1>
            </div>
            
            <SearchBar />

            <div className="flex flex-row items-center gap-4">
                <button onClick={()=> navigate("/")} 
                    className="text-slate-200 font-mono "
                >
                    All Book
                </button>
                {
                    !auth && (
                        <>
                            <button onClick={()=> navigate("/sign-in")} className="relative p-2 text-lg font-mono  text-white bg-indigo-700 px-4 py-2 gap-1 rounded-md hover:bg-indigo-600 transition-colors cursor-pointer">
                                Sign In
                            </button>
                            <button
                                onClick={()=> navigate("/sign-up")}
                                className="relative p-2 text-lg  text-white cursor-pointer underline font-mono"
                            >
                                Sign Up
                            </button>
                        </>
                    )
                }

                {auth && auth.role === "ADMIN" && (
                    <button onClick={()=> navigate("/admin")} className="relative p-2 text-lg text-white bg-indigo-700 px-4 py-2 gap-1 rounded-md hover:bg-indigo-800 transition-colors cursor-pointer">
                    Admin Dashboard
                </button>
                )}
                
                <button onClick={()=> navigate("/cart")} className="relative p-2 text-xl text-gray-200 dark:text-gray-200  hover:text-gray-200 dark:hover:text-gray-300 transition-colors cursor-pointer">
                    <ShoppingCart />
                    <div className="absolute right-0 bottom-0  rounded-full bg-red-500 w-6 h-6 items-center justify-center">
                    <p className=" text-white  ">{totalItems}</p>
                    </div>
                </button>

            </div>
        </header>
    )
}