import { useCart } from "../providers/CartProvider";
import { useNavigate } from "react-router-dom";
import { useForm} from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";

const api = 'http://localhost:8800/api/v1/orders'

type CheckoutInputs = {
    address: string;
    phone: string;
};

export default function Checkout(){
    const {items, dispatch} = useCart();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<CheckoutInputs>();

    const totalCost = items.reduce((total,item)=> total + item.price * item.quantity,0);

    const onSubmit: SubmitHandler<CheckoutInputs> = async(data) => {
        if(items.length === 0){
            navigate("/");
            return;
        }

        try{
            const token = localStorage.getItem('token');
            const res = await fetch(`${api}/checkout`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: items,
                    shippingAddress: `${data.address} (Phone: ${data.phone})`,
                })
            });

            if(!res.ok){
                throw new Error('Something went wrong');
            }
            const responseData = await res.json();
            dispatch({type: 'CLEAR_CART'});
            navigate(`/order-success/${responseData.newOrder.orderNumber}`);

        }catch(err:any){
            console.log(err);
        }
    }

    return(
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Form Section */}
                <div className="flex-1 bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Shipping Details</h2>
                    <form 
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Shipping Address</label>
                            <textarea  
                                {...register("address", {required: "Address is required"})}
                                placeholder="123 Street, City, Country"
                                rows={4}
                                className={`w-full bg-slate-900/50 border ${errors.address ? 'border-red-500' : 'border-slate-600'} rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none shadow-inner`}
                            />
                            {errors.address && <p className="text-red-500 text-sm ml-1">{errors.address.message}</p>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Phone Number</label>
                            <input type="tel"
                                {...register("phone", {required: "Phone is required", pattern:{value:/^[0-9]{9,15}$/, message: "Invalid phone number"}})}
                                placeholder="+1234567890"
                                className={`w-full bg-slate-900/50 border ${errors.phone ? 'border-red-500' : 'border-slate-600'} rounded-xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-inner`}
                            />
                            {errors.phone && <p className="text-red-500 text-sm ml-1">{errors.phone.message}</p>}

                        </div>
                        <button 
                            type="submit"
                            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20 cursor-pointer text-lg"
                        >
                            Place Order
                        </button>
                    </form>
                </div>

                {/* Order Summary Section */}
                <div className="w-full lg:w-96 bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-700 h-fit sticky top-24">
                    <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b border-slate-700">Order Summary</h2>
                    
                    <div className="space-y-5 mb-8 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent pr-2">
                        {items.map(item => (
                            <div key={item.sellBookId} className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h4 className="text-slate-200 font-semibold text-sm line-clamp-2">{item.title}</h4>
                                    <p className="text-slate-400 text-sm mt-1">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-slate-300 font-medium whitespace-nowrap text-sm">{(item.price * item.quantity).toLocaleString()} MMK</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-slate-700 pt-6 space-y-4">
                        <div className="flex justify-between items-center text-slate-300 text-sm">
                            <span>Subtotal</span>
                            <span className="font-medium text-white">{totalCost.toLocaleString()} MMK</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300 text-sm">
                            <span>Shipping</span>
                            <span className="text-slate-500">Free</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-700">
                            <span className="text-lg font-bold text-white">Total</span>
                            <span className="text-2xl font-bold text-indigo-400">{totalCost.toLocaleString()} MMK</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}