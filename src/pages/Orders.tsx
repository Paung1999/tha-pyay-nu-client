import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import type { Order } from "../global/types";
import { Link } from "react-router-dom";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";

const api = "http://localhost:8800/api/v1/orders";

export default function Orders(){
    const { data: orders , isLoading, isError} = useQuery<Order[]>({
        queryKey: ["orders"],
        queryFn: async()=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}`, {
                method: "GET",
                headers:{
                    "Authorization": `Bearer ${token}`
                
                }
            });
            if(!res.ok){
                throw new Error("Something went wrong");
            }
            return res.json();

        },
        staleTime: 1000 * 60 * 60 * 24,
    });
    if(isLoading){
        return <Loading />
    }
    if(isError){
        return <h1>Something went wrong</h1>
    }

    return(
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8  py-12">
            <div className="flex flex-col justify-start items-center gap-3 text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-700 mb-4 tracking-tight">My Orders</h1>
                <p className="text-lg text-slate-400 max-w-xl">Track your journey and view your past orders.</p>
            </div>
            
            <div className="flex flex-col gap-6 w-full">
                {orders?.length === 0 ? (
                    <div className="text-center p-12 bg-slate-800 rounded-3xl border border-slate-700/50 shadow-inner">
                        <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">No orders found</h3>
                        <p className="text-slate-400 mb-8">Looks like you haven't made any purchases yet.</p>
                        <Link 
                            to="/" 
                            className="inline-flex bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 cursor-pointer"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    orders?.map((order)=>(
                        <div key={order.id} className="bg-slate-800 border border-slate-700 hover:border-indigo-500/50 transition-colors rounded-2xl p-6 md:p-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group">
                            <div className="flex flex-row items-center gap-5">
                                <div className="w-14 h-14 bg-slate-900/50 rounded-full flex shrink-0 items-center justify-center border border-slate-700 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-colors">
                                    <Package className="w-7 h-7 text-indigo-400" />
                                </div>
                                <div className="flex flex-col justify-center items-start text-left">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order Number</p>
                                    <h2 className="text-xl font-bold text-slate-200 tracking-wide leading-none mb-1.5">{order.orderNumber}</h2>
                                    <span className="text-sm font-medium text-slate-400">
                                        Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="w-full sm:w-auto mt-2 sm:mt-0">
                                <Link
                                    to={`/order-success/${order.orderNumber}`}
                                    className="w-full sm:w-auto flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer border border-slate-600 hover:border-slate-500"
                                >
                                    View Details
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

}