import type {Book} from "../global/types.ts";
import {Dialog, DialogContent, DialogTitle} from "@mui/material";
import { Save} from "lucide-react";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {useListBookToStoreMutation, useUpdateListedBookMutation} from "../libs/features/listing/listingApiSlice.ts";
import {useNotify} from "../providers/NotifyProvider.tsx";

export interface ListingDialogProps{
    open:boolean;
    handleClose:() => void;
    listedBookToEdit?: Book;
    bookId?: number
}

export interface ListingBookFormData {
    price: number,
    currency: string,
    stockQuantity: number,
    condition: string,
    isActive: boolean,
}

const getDefaultValues = (book?:Book) : ListingBookFormData => ({
        price: book?.price ?? 0,
        currency: book?.currency ?? '',
        stockQuantity: book?.stockQuantity ?? 0,
        condition: book?.condition ?? '',
        isActive: book?.isActive ?? true,

})

export default function ListingDialog({open, handleClose, listedBookToEdit, bookId}: ListingDialogProps){
    const [listBook, { isLoading} ] = useListBookToStoreMutation();
    const [updateListedBook ] = useUpdateListedBookMutation();
    const notify = useNotify();
    const {
        register,
        handleSubmit,
        reset ,
        formState:{errors} }
        = useForm<ListingBookFormData>({defaultValues: getDefaultValues(listedBookToEdit)});

    useEffect(()=>{
        if(open){
            reset(getDefaultValues(listedBookToEdit));
        }
    },[open, listedBookToEdit, reset]);


    const onSubmit = async  (data:ListingBookFormData) => {
        if(listedBookToEdit){
          await  updateListedBook({id:listedBookToEdit.id, body: data}).unwrap();
          notify?.success('Listing updated successfully.');
        }else{
           await listBook({...data, bookId}).unwrap();
           notify?.success('Listing  successfully.');

        }
        handleClose();
    }

    const handleCancel = () => {
        reset(getDefaultValues(listedBookToEdit));
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="lg">
            <DialogTitle>
                {listedBookToEdit? 'Edit listing' : 'Book Listing'}
            </DialogTitle>
            <DialogContent>
                <div className="max-w-4xl mx-auto space-y-6 relative pb-12">
                    {/*<div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center gap-6 shadow-md">*/}
                    {/*    <img src={selectedBook?.coverImage} alt={selectedBook.title}*/}
                    {/*         className="w-12 h-16 object-cover rounded shadow-sm"*/}
                    {/*    />*/}
                    {/*    <div >*/}
                    {/*        <p className="text-slate-400 font-medium">Selected Book for Listing:</p>*/}
                    {/*        <p className="text-white font-semibold">Title: {selectedBook.title}</p>*/}
                    {/*        <p className="text-white font-semibold">Author: {selectedBook.author}</p>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden p-8">
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300" >Price</label>
                                    <input type="number"
                                           {...register("price", {required: "Price is required", valueAsNumber:true})}
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
                                    <input type="number" {...register("stockQuantity", {required: "Stock quantity is required", valueAsNumber:true})}
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
                                    <select {...register("isActive", {setValueAs: (v) => v === true || v === "true"  })}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="true">Active (Visuable in store)</option>
                                        <option value="false">Inactive (Hidden from store)</option>
                                    </select>
                                    {errors.isActive && <p className="text-red-400 text-xs mt-1">{String(errors.isActive.message)}</p>}
                                </div>

                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end">

                            <button type="button" onClick={ handleCancel} className="px-6 py-2.5 text-slate-300 hover:text-white font-medium transition-colors mr-4 cursor-pointer">
                                Cancel
                            </button>

                            <button type="submit" disabled={isLoading}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                            >
                                <Save size={20}/>
                                {isLoading ? "Creating Listing..." : "List"}
                            </button>
                        </div>

                    </form>

                </div>
            </DialogContent>
        </Dialog>
    )
}