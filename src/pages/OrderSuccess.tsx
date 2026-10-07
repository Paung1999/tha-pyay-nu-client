
import Loading from "../components/Loading";

import { useParams, Link } from "react-router-dom";
import {  Truck, ShoppingBag, CheckCircle2} from "lucide-react";
import OrderTracker from "../components/OrderTracker";
import {useGetClientOrderByIdQuery} from "../libs/features/orders/orderApiSlice.ts";

const OLD_FORMAT = /^(.*?)\s*\(Phone:\s*([^)]+)\)\s*$/i;

interface ParsedShipping {
    address: string;
    phone: string | null;
}

export const parseShipping = (snapshot: unknown): ParsedShipping => {
    if (!snapshot) return { address: "No address provided", phone: null };

    // old orders: plain string
    if (typeof snapshot === "string") {
        const match = snapshot.match(OLD_FORMAT);
        if (match) {
            return { address: match[1].trim(), phone: match[2].trim() };
        }
        // string without a phone part: keep the whole thing as the address
        return { address: snapshot, phone: null };
    }

    // new orders: { phone, address }
    const s = snapshot as { address?: string; phone?: string };
    return {
        address: s.address ?? "No address provided",
        phone: s.phone ?? null,
    };
};

export default function OrderSuccess(){
    const {orderNumber} = useParams();
    const {data: order, isLoading,isError} = useGetClientOrderByIdQuery(orderNumber!);
    const {address,phone } = parseShipping(order?.shippingAddressSnapshot)
    if(isLoading){
        return <Loading />
    }
    if(isError){
        return <h1>Something went wrong</h1>
    }

    return(
        <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col items-center justify-center">

           
            <div className="flex flex-col items-center text-center mb-12">
                <OrderTracker status={order!.status} />
                <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6 mt-6">
                    <CheckCircle2 className="w-8 h-8 text-indigo-500"  />
                </div>
                

                <h1 className="text-4xl md:text-5xl font-black text-slate-200 mb-4 tracking-tight">Order Confirmed!</h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed">
                    Thank you for your purchase. We're preparing your journey into new worlds.
                </p>
            </div>

          
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
                
                
                <div className="flex flex-col gap-6">
                   
                    <div className="bg-[#1a1f2e] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
                        <div className="flex items-center gap-2 mb-6">
                            <Truck className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-lg font-bold text-white">Logistics Details</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Order Number</p>
                                <p className="text-indigo-400 font-bold">{order?.orderNumber}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Shipping Address</p>
                            <p className="text-slate-300 leading-relaxed max-w-[250px]">
                                {address}
                            </p>

                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider mt-2">Phone </p>
                            <p className="text-slate-300 leading-relaxed max-w-[250px]">
                                {phone}
                            </p>

                        </div>
                    </div>

                    
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            to="/"
                            className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                        <Link 
                            to="/orders"
                            className="flex-1 flex justify-center items-center gap-2 bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-700 hover:text-white py-3.5 rounded-xl font-bold transition-all"
                        >
                            View My Orders
                        </Link>
                    </div>
                </div>

                <div className="bg-[#1a1f2e] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col h-full">
                    <h2 className="text-lg font-bold text-white mb-6">Archive Summary</h2>
                    
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-6">
                        {order?.orderItems?.map((item: any) => (
                            <div key={item.id} className="flex gap-4 items-center">
                                
                                <div className="w-14 h-20 bg-slate-800 rounded overflow-hidden shrink-0 shadow-md">
                                    <img 
                                        src={item.sellBook?.book?.coverImage || '/placeholder-book.png'} 
                                        alt={item.titleSnapshot}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                               
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold text-sm truncate">{item.titleSnapshot}</h4>
                                    <p className="text-slate-400 text-xs mt-0.5 truncate">{item.sellBook?.book?.author}</p>
                                    <p className="text-indigo-400 font-bold text-sm mt-1">
                                        {item.unitPriceSnapshot.toLocaleString()} MMK {item.quantity > 1 && <span className="text-slate-500 text-xs ml-1">(x{item.quantity})</span>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    
                    <div className="border-t border-slate-800 pt-6 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-medium">Subtotal</span>
                            <span className="text-white font-bold">{order?.subtotal?.toLocaleString()} MMK</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400 font-medium">Shipping</span>
                            <span className="text-emerald-400 font-bold uppercase text-xs">Free</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 mt-1">
                            <span className="text-lg font-bold text-indigo-400">Total</span>
                            <span className="text-xl font-black text-indigo-400">{order?.total?.toLocaleString()} MMK</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )


}