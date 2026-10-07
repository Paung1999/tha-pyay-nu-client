
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {
    closeCart,
    selectCartItem,
    selectCartItemCount, selectCartTotal,
    selectIsCartOpen,
} from "../libs/features/cart/cartSlice.ts";



export default function CartDrawer(){
    const isOpen = useAppSelector(selectIsCartOpen);
    const cartItems = useAppSelector(selectCartItem);
    const navigate = useNavigate();
    const totalItems = useAppSelector(selectCartItemCount);
    const totalCost = useAppSelector(selectCartTotal);
    const dispatch = useAppDispatch();



    return(
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
                    onClick={()=> dispatch(closeCart())}
                />
            )}

            <div className={`fixed inset-y-0 right-0 z-50 w-[90vw] sm:w-96 bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/95">
                    <div className="flex items-center gap-3">
                        <ShoppingCart className="text-indigo-400" size={24} />
                        <h2 className="text-xl font-bold text-white tracking-wide">Your Cart</h2>
                        <div className="flex rounded-full bg-red-500 w-6 h-6 items-center justify-center">
                            <p className="text-white text-xs font-bold">{totalItems}</p>
                        </div>
                    </div>
                    <button 
                        onClick={()=>dispatch(closeCart())}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={20}/>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                <ShoppingCart className="text-slate-500" size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-200">Your cart is empty</h3>
                            <p className="text-slate-400 text-sm mt-2 max-w-[200px]">
                                Looks like you haven't added any books yet.
                            </p>
                        </div>
                    ) : (
                        cartItems.map((item)=>(
                            <div key={item.sellBookId} className="flex gap-4 group">
                                <div className="w-20 h-28 bg-slate-800 rounded-md shrink-0 overflow-hidden shadow-md border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col flex-1 py-1">
                                    <h3 className="text-slate-100 font-semibold text-base leading-snug line-clamp-2 mb-1">{item.title}</h3>
                                    <p className="text-slate-50 font-mono font-thin">By {item.author}</p>
                                    <div className="mt-auto">
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                                            Qty: {item.quantity}
                                        </span>
                                    </div>
                                    <p className="text-indigo-400 font-bold text-sm mt-auto">{item.price.toLocaleString()} {item.currency}
                                        <span className="text-sm text-slate-50 font-mono font-thin ml-2">each</span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="p-5 border-t border-slate-800 bg-slate-900/95 mb-4">
                        <div className="flex justify-between items-end mb-5">
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Subtotal ( {totalItems} {cartItems.length > 1 ? "items" : "item"} )</span>
                            <span className="text-2xl font-bold text-white">{totalCost} <span className="text-lg font-medium text-slate-400">MMK</span></span>
                        </div>
                        <div className="flex flex-col justify-between gap-3 items-end mb-2 ">
                            <button 
                            onClick={() => {
                                dispatch(closeCart());
                                navigate("/");
                            }}
                            className="w-full bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white py-3.5 rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 cursor-pointer flex justify-center items-center gap-2"
                        >
                            Continue Shopping
                        </button>
                        <button 
                            onClick={() => {
                                dispatch(closeCart())
                                navigate("/cart");
                            }}
                            className="w-full bg-slate-800 hover:bg-indigo-600 active:bg-indigo-700 border border-indigo-600 text-white py-3.5 rounded-xl font-semibold text-lg transition-all active:scale-[0.98] cursor-pointer flex justify-center items-center gap-2"
                        >
                            View cart & checkout
                        </button>
                        </div>
                    </div>
                )}

            </div>
        </>
    )
}