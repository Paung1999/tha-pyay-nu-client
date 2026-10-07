

import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import Loading from "../components/Loading";
import {useSearchBookQuery} from "../libs/features/book/bookApiSlice.ts";


export default function SearchResultPage(){
    const [searchParams] = useSearchParams();
    const term = (searchParams.get("q") ?? "").trim();

    const {data: books=[], isFetching, isError} = useSearchBookQuery(term,{
        skip: term.length === 0
    });


    return(
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-semi-bold text-slate-300 mb-8">Search for : {term}</h1>
            {isFetching && <p><Loading/></p>}
            {isError && <p className="text-red-500">Error Fetching books...</p>}
            {!isFetching && !isError && books.length === 0 &&(
                <p className='text-slate-500'>No books found...</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {books && books.map((book) => (
                    <BookCard key={book.book.id} listedBook={book} />
                ))}
            </div>
        </div>
    )
}