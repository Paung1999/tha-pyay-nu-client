import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ArrowLeft, Save } from "lucide-react";


const api = "http://localhost:8800/api/v1/admin";

type BookType = {
    id: number,
    title: string,
    author: string
}

export default function CreateListing(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors} } = useForm();

    const selectedBook = location.state?.selectedBook;

    if (!selectedBook) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-400 mb-4">No book selected!</p>
                <button onClick={() => navigate("/admin/inventory")} className="bg-indigo-600 px-4 py-2 rounded text-white">
                    Go back to Inventory to select a book
                </button>
            </div>
        );
    }

    const createListingMutation = useMutation({
        mutationFn: async (listingData: any)=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/sell-books`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`

                },
                body: JSON.stringify(listingData)
            });

            if(!res.ok){
                throw new Error("Failed to create listing");
            
            }
            return res.json();
        
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["books"]});
            alert("Listing created successfully");
            navigate("/admin/listings");

        },
        onError: (error: any)=> {
            alert(error.message);
        }

    });

    const onSubmit = (data: any) => {
        const listingData = {
            bookId: selectedBook.id,
            price: Number(data.price),
            currency: data.currency,
            stockQuantity: Number(data.stockQuantity),
            condition: data.condition,
            isActive: data.isActive === "true"
        
        }
        createListingMutation.mutate(listingData);
    
    }

    return(
        <div className="max-4xl mx-auto space-y-6 relative pb-12">
            <div className="flex items-center gap-4">
                <button onClick={()=>navigate(-1)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        Create Listing
                    </h1>
                    <p className="text-slate-400 mt-1">Add a new book to your inventory.</p>
                </div>

            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center gap-6 shadow-md">
                <img src={selectedBook.coverImage} alt={selectedBook.title}
                    className="w-12 h-16 object-cover rounded shadow-sm"
                />
                <div >
                    <p className="text-slate-400 font-medium">Selected Book for Listing:</p>
                    <p className="text-white font-semibold">Title: {selectedBook.title}</p>
                    <p className="text-white font-semibold">Author: {selectedBook.author}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden p-8">
                <div className="p-8 space-y-8"> 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" >Price</label>
                            <input type="number"
                                {...register("price", {required: "Price is required"})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                                placeholder="Enter price"

                            />
                            {errors.price && <p className="text-red-400 text-xs mt-1">{String(errors.price.message)}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300" >Currency</label>
                            <select {...register("currency", {required: "Currency is required"})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" >
                                <option value="">Select a currency</option>
                                <option value="MMK">MMK</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="JPY">JPY</option>
                            </select>
                            {errors.currency && <p className="text-red-400 text-xs mt-1">{String(errors.currency.message)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Stock Quantity</label>
                            <input type="number" {...register("stockQuantity", {required: "Stock quantity is required"})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                                placeholder="Enter stock quantity"

                            />
                            {errors.stockQuantity && <p className="text-red-400 text-xs mt-1">{String(errors.stockQuantity.message)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Condition</label>
                            <input type="text" {...register("condition", {required: "Condition is required"})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                                placeholder="Enter condition"
                            />
                            {errors.condition && <p className="text-red-400 text-xs mt-1">{String(errors.condition.message)}</p>}

                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">isActive</label>
                            <select {...register("isActive", {required: "isActive is required"})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                defaultValue="true"
                            >
                                <option value="true">Active (Visuable in store)</option>
                                <option value="false">Inactive (Hidden from store)</option>
                            </select>
                            {errors.isActive && <p className="text-red-400 text-xs mt-1">{String(errors.isActive.message)}</p>}
                        </div>

                    </div>
                </div>
                <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end">
                    <button type="submit" disabled={createListingMutation.isPending}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                        <Save size={20}/>
                        {createListingMutation.isPending ? "Creating Listing..." : "List"}
                    </button>
                </div>

            </form>

        </div>
    )
}