import {useEffect, useRef, useState} from "react";
import useDebounce from "../hooks/useDebounce.ts";
import {useSearchBookQuery} from "../libs/features/book/bookApiSlice.ts";
import {useNavigate} from "react-router-dom";
import {Loader2, Search, X} from "lucide-react";

export default function SearchBar(){
    const [inputValue, setInputValue ] = useState("");
    const deBouncedValue = useDebounce(inputValue, 500);
    const trimmedTerm = deBouncedValue.trim();
    const [showResults , setShowResults] = useState<boolean>(false);
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const {data:suggestions=[], isFetching, isError } =useSearchBookQuery(trimmedTerm,{
        skip: trimmedTerm.length === 0
    });

    useEffect(()=>{
        setShowResults(trimmedTerm.length > 0);
    },[trimmedTerm]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim().length > 0) {
            setShowResults(false);
            navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
        }
    };
    const handleSelectBook = (title:string) => {
        navigate(`/search?q=${encodeURIComponent(title)}`);
        setShowResults(false);
        setInputValue("");
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return(
        <div ref={containerRef} className='relative max-w-7xl mx-auto  '>
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
                            type="button"
                            onClick={() => setInputValue("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </form>
            </div>
            {
                showResults && inputValue.trim().length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-slate-800 border border-slate-700 rounded-xl
                    shadow-2xl overflow-hidden z-50 max-h-[28rem] overflow-y-auto">
                        {isFetching && (
                            <div className="p-6 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-6 w-6 text-indigo-500" />
                                <span className="text-sm">Searching library...</span>
                            </div>
                        )}
                        {isError && (
                            <div className="p-4 text-center text-red-400 text-sm">
                                Error loading results. Please try again.
                            </div>
                        )}
                        {
                            suggestions.length > 0 && (
                                <ul className='py-2 overflow-y-auto max-h-'>
                                    {suggestions.map((suggestion) =>(
                                        <li key={suggestion.id} className="border-b border-slate-700/60 last:border-none">
                                            <button type={'button'} onClick={()=>handleSelectBook(suggestion.book.title)}
                                                    className="group flex w-full items-center gap-3 px-3 py-2.5 text-left
                                                    transition-colors hover:bg-slate-700/60 focus-visible:bg-slate-700/60 focus-visible:outline-none"
                                            >
                                                <div className='h-14 w-10 shrink-0 overflow-hidden rounded bg-slate-700'>
                                                    <img src={suggestion.book.coverImage} alt={suggestion.book.title}/>
                                                </div>
                                                <div className='flex flex-col'>
                                                    <h4 className='text-sm font-semibold text-slate-400 group-hover:text-indigo-600'>
                                                        {suggestion.book.title}
                                                    </h4>
                                                    <p className='text-sm text-slate-400'>
                                                        {suggestion.book.author}
                                                    </p>
                                                    <p className='text-sm text-slate-400'>
                                                        {suggestion.price} {suggestion.currency}

                                                    </p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                    </div>
                )
            }
        </div>

    )
}