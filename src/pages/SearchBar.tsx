import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import type { Book } from "../global/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Loader2, X } from "lucide-react";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";

const api = "http://localhost:8800/api/v1/books";

function useDebounce(value: string, delay: number) {
    const [deBounceValue, setDebounceValue] = useState(value);

    useEffect(()=> {
        const handler = setTimeout(()=> {
            setDebounceValue(value);
        },delay);
        return ()=> clearTimeout(handler);
    },[value, delay]);

    return deBounceValue;
}

export default function SearchBar({ isSearchResultsPage }: { isSearchResultsPage?: boolean }){
    const [inputValue, setInputValue ]= useState("");
    const debouncedInputValue = useDebounce(inputValue, 500);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const searchTerm = isSearchResultsPage ? (query || "") : debouncedInputValue;

    const navigate = useNavigate();
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const {data: searchedBooks, isLoading, isError} = useQuery<Book[]>({
        queryKey: ["books", 'search', searchTerm],
        queryFn: async()=> {
            if (!searchTerm) return [];
            const res = await fetch(`${api}/search?q=${searchTerm}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if(!res.ok){
                throw new Error("Failed to fetch books");
            }
            return res.json();
        },
        enabled: searchTerm.trim().length > 0,
    });

    useEffect(() => {
        if (!isSearchResultsPage) {
            if (debouncedInputValue.trim().length > 0) {
                setShowResults(true);
            } else {
                setShowResults(false);
            }
        }
    }, [debouncedInputValue, isSearchResultsPage]);

    const handleSelectBook = (title: string) => {
        navigate(`/search?q=${encodeURIComponent(title)}`);
        setShowResults(false);
        setInputValue("");
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault(); 
        if (inputValue.trim().length > 0) {
            setShowResults(false);
            navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
        }
    };

    if (isSearchResultsPage) {
        return (
            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold text-slate-700 mb-8">Search Results: "{searchTerm}"</h1>
                {isLoading && <Loading />}
                {isError && <p className="text-red-500">Error fetching books.</p>}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {searchedBooks?.map((book) => (
                        <BookCard key={book.book.id} listedBook={book} />
                    ))}
                </div>
            </div>
        );
    }

    return(
        <div ref={containerRef} className="relative w-full max-w-md mx-4 hidden md:block">
            <div className="relative group">
                <form onSubmit={handleSearchSubmit}>
                    <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e)=> setInputValue(e.target.value)}
                    placeholder="Search for books..."
                    className="w-full bg-slate-800 text-slate-200 placeholder-slate-400 border border-slate-700 rounded-full py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:border-slate-600"
                />
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                
                {inputValue && (
                    <button 
                        onClick={() => setInputValue("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
                </form>
            </div>

            {showResults && inputValue.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[28rem] overflow-y-auto backdrop-blur-xl bg-slate-800/95 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {isLoading ? (
                        <div className="p-6 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                            <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                            <span className="text-sm">Searching library...</span>
                        </div>
                    ) : isError ? (
                        <div className="p-4 text-center text-red-400 text-sm">
                            Error loading results. Please try again.
                        </div>
                    ) : searchedBooks?.length === 0 ? (
                        <div className="p-6 text-center text-slate-400">
                            <p className="text-sm font-medium">No books found</p>
                            <p className="text-xs text-slate-500 mt-1">Try searching for a different title or author</p>
                        </div>
                    ) : (
                        <ul className="py-2">
                            {searchedBooks?.map((book)=> (
                                <li key={book.book.id}>
                                    <button 
                                        onClick={() => handleSelectBook(book.book.title)}
                                        className="w-full text-left flex items-start gap-4 p-3 hover:bg-indigo-500/10 cursor-pointer transition-colors border-b border-slate-700/50 last:border-none group"
                                    >
                                        <div className="w-12 h-16 shrink-0 rounded bg-slate-700 overflow-hidden shadow-sm">
                                            {book.book?.coverImage ? (
                                                <img src={book.book?.coverImage} alt={book.book?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="text-sm font-semibold text-slate-200 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                                                {book.book?.title}
                                            </h4>
                                            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                                                by {book.book?.author}
                                            </p>
                                            {book.price && (
                                                <p className="text-xs text-emerald-400 font-medium mt-1.5">
                                                    {book.price} {book.currency}
                                                </p>
                                            )}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    )
}