import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Book } from "../../global/types";
import { ArrowLeft, Save } from "lucide-react";
import Loading from "../../components/Loading";


const api = "http://localhost:8800/api/v1/admin";


export default function EditListedBook(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();
    const { register, handleSubmit,reset, formState: { errors} } = useForm();

    const {data:bookToEdit, isLoading: isBookLoading, isError} = useQuery<Book>({
        queryKey: ["book", id],
        queryFn: async()=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/sell-books/${id}`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if(!res.ok){
                throw new Error("Failed to fetch book");
            }
            return res.json();

        },
        enabled: !!id

    });

    useEffect(()=>{
        if(bookToEdit){
            reset({
                price: bookToEdit.price,
                currency: bookToEdit.currency,
                stockQuantity: bookToEdit.stockQuantity,
                condition: bookToEdit.condition,
                isActive: bookToEdit.isActive.toString()
            });
        }
    },[bookToEdit, reset]);

    const editListingMutation = useMutation({
        mutationFn: async (listingData: any)=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/sell-books/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`

                },
                body: JSON.stringify(listingData)
            });

            if(!res.ok){
                throw new Error("Failed to edit listing");
            
            }
            return res.json();
        
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["books"]});
            alert("Listing edited successfully");
            navigate("/admin/listings");

        },
        onError: (error: any)=> {
            alert(error.message);
        }

    });

    const onSubmit = (data: any) => {
        const listingData = {
            bookId: bookToEdit?.book?.id,
            price: Number(data.price),
            currency: data.currency,
            stockQuantity: Number(data.stockQuantity),
            condition: data.condition,
            isActive: data.isActive === "true"
        
        }
        editListingMutation.mutate(listingData);
    
    }

    if(isBookLoading){
        return <Loading />
    }

    if(isError || !bookToEdit){
        return <div className="text-red-400 p-8 text-center">Error loading book details.</div>
    }

    return(
        <div className="max-4xl mx-auto space-y-6 relative pb-12">
            <div className="flex items-center gap-4">
                <button onClick={()=>navigate(-1)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        Edit Listing
                    </h1>
                    <p className="text-slate-400 mt-1">Edit the listing for this book.</p>
                </div>

            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center gap-6 shadow-md">
                <img src={bookToEdit.book?.coverImage} alt={bookToEdit.book?.title}
                    className="w-12 h-16 object-cover rounded shadow-sm"
                />
                <div >
                    <p className="text-slate-400 font-medium">Selected Book for Listing:</p>
                    <p className="text-white font-semibold">Title: {bookToEdit.book?.title}</p>
                    <p className="text-white font-semibold">Author: {bookToEdit.book?.author}</p>
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
                    <button type="submit" disabled={editListingMutation.isPending}
                        className="bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                        <Save size={20}/>
                        {editListingMutation.isPending ? "Editing Listing..." : "Edit"}
                    </button>
                </div>

            </form>

        </div>
    )
}