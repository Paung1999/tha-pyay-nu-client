import BookCard from "../components/BookCard";
import HeroSection from "../components/HeroSection";
import Genres from "../components/Genres";
import Loading from "../components/Loading";
import { useState } from "react";
import {useGetBooksQuery, useGetGenresQuery} from "../libs/features/book/bookApiSlice.ts";


export default function Home(){
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

    const {data: genres } = useGetGenresQuery(undefined);
    const {data: listedBooks, isLoading , isError } = useGetBooksQuery(selectedGenre);
    console.log(genres);
    console.log(listedBooks);

    if(isError){
        return <div>Something is wrong...</div>
    }
    if(isLoading){
        return <Loading/>
    }

    return(
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <HeroSection />

            <div id="browse-section" className="py-8 scroll-mt-24">
                <Genres genres={genres} setSelectedGenre={setSelectedGenre} selectedGenre={selectedGenre} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 pb-8">
                {listedBooks?.map((listedBook)=>{

                    return <BookCard key={listedBook.id} listedBook={listedBook} />
                })}
            </div>
        </div>
    )
}