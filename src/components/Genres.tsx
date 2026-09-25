import type { Genre } from "../global/types";

type GenresProps = {
    genres: Genre[] | undefined;
    selectedGenre: number | null;
    setSelectedGenre: (genreId: number | null) => void;
}

export default function Genres({genres, setSelectedGenre, selectedGenre}: GenresProps){
    return(
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <button
                onClick={()=>setSelectedGenre(null)}
                className={`whitespace-nowrap px-6 py-2 rounded-lg font-medium transition-colors ${
                        selectedGenre === null 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"
                    }`}

            >
                All
            </button>
            {genres && genres.map((genre)=>(
                <button
                    key={genre.id}
                    onClick={()=>setSelectedGenre(genre.id)}
                    className={`whitespace-nowrap px-6 py-2 rounded-lg font-medium transition-colors ${
                        selectedGenre === genre.id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700"
                    }`}
                >
                    {genre.name}
                </button>
            )) }

        </div>

    )
}