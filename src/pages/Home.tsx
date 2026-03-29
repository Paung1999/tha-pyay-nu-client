import BookCard from "../components/BookCard";
import HeroSection from "../components/HeroSection";
import Genres from "../components/Genres";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import type { Book, Genre } from "../global/types"
import { useState } from "react";

const api = "http://localhost:8800/api/v1/books";



export default function Home(){
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

    const {data: genres} = useQuery<Genre[]>({
        queryKey: ["genres"],
        queryFn: async()=> {
            const res = await fetch(`${api}/genres`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(!res.ok){
                throw new Error("Failed to fetch genres");
            }
            return res.json();
        }
    });

    const {data: listedBooks, isLoading, isError} = useQuery<Book[]>({
        queryKey: ["listedBooks", selectedGenre],
        queryFn: async() => {
            const endpoint = selectedGenre? `${api}/genres/${selectedGenre}` : `${api}`;
            const res = await fetch(endpoint);
            if(!res.ok){
                throw new Error("Something went wrong");
            }
            const data = await res.json();
            return Array.isArray(data) ? data : (data.listedBooks || []);
        },

    });

    if(isLoading){
       return <Loading />

    }
    if(isError){
        return <h1>Something went wrong</h1>
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