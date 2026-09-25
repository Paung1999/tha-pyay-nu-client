import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import Loading from "../components/Loading";
import { ShoppingCart, Tag, Globe, Hash, BookOpen } from "lucide-react";
import {useAppDispatch} from "../app/hooks";
import {addToCart, openCart} from "../libs/features/cartSlice.ts";
import "./../globals.css";

const api = "http://localhost:8800/api/v1/books"

export default function BookDetails(){
    const {id} = useParams();
    const dispatch = useAppDispatch();
    const {data:listedBook, isLoading, isError } = useQuery({
        queryKey: ["listedBook", id],
        queryFn: async()=> {
            const res = await fetch(`${api}/${id}`);
            if(!res.ok){
                throw new Error("Can't fetch book detail")
            }
            return res.json()
        }
    });
    if(isLoading){
       return <Loading />

    }
    if(isError){
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-500">
                <h1 className="text-2xl font-bold">Something went wrong</h1>
            </div>
        )
    }

    const handleAddToCart = ( ) => {
        dispatch(addToCart(listedBook));
        dispatch(openCart());
    }

    return(
        <div className="w-full min-h-screen  text-slate-200 font-sans py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-10 lg:gap-16">
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-2xl border border-slate-700 group">
                            <img 
                                src={listedBook.book?.coverImage} 
                                alt={listedBook.book?.title} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>

                   
                    <div className="flex-1 flex flex-col">
                        <div className="mb-8">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-3 leading-tight">
                                {listedBook.book.title}
                            </h1>
                            <p className="text-xl text-indigo-400 font-medium mb-6">
                                {listedBook.book.author}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 border-b border-slate-800 pb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-yellow-500">
                                        {listedBook.price}
                                    </span>
                                    <span className="text-xl font-medium text-yellow-500/80">
                                        {listedBook.currency}
                                    </span>
                                </div>
                                
                                <button
                                    onClick={()=>handleAddToCart()}
                                    className="flex items-center justify-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 active:scale-95 w-full sm:w-auto cursor-pointer"
                                >
                                    <ShoppingCart size={20} />
                                    Add to Cart
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                                        <Tag size={18} className="text-indigo-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Genre</span>
                                    </div>
                                    <p className="text-lg font-semibold text-white">{listedBook.book.gereName || "Unknown"}</p>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                                        <Globe size={18} className="text-indigo-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Language</span>
                                    </div>
                                    <p className="text-lg font-semibold text-white">{listedBook.book.language}</p>
                                </div>

                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors sm:col-span-2">
                                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                                        <Hash size={18} className="text-indigo-400" />
                                        <span className="text-xs font-bold uppercase tracking-wider">ISBN</span>
                                    </div>
                                    <p className="text-lg font-semibold text-white font-mono tracking-wide">{listedBook.book.isbn}</p>
                                </div>
                            </div>
                        </div>
                        
                        {listedBook.book.description && (
                           <div className="prose prose-invert max-w-none">
                               <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                                   <BookOpen size={20} className="text-indigo-400"/>
                                   About this book
                               </h3>
                               <p className="text-slate-300 leading-relaxed">
                                   {listedBook.book.description}
                               </p>
                           </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}