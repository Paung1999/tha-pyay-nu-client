
import Loading from "../../components/Loading";
import { useGetAdminGenresQuery} from "../../libs/features/genre/genreApiSlice.ts";
import DeleteGenreButton from "../../components/DeleteGenreButton.tsx";
import EditGenreButton from "../../components/EditGenreButton.tsx";
import GenreDialog from "../../components/GenreDialog.tsx";
import useDialog from "../../hooks/useDialog.ts";


export default function Genres(){
    const {open, setOpen, handleClose } = useDialog();

    const newGenreHandler = () => {
        setOpen(true);
    }

    const {data: genres, isLoading, isError} = useGetAdminGenresQuery(undefined);

    if(isLoading){
        return <Loading />
    }
    if(isError){
        return <div className="text-red-400 p-8 text-center">Error loading genres. Are you logged in as an Admin?</div>
    }
    return (
        <div className="max-w-4xl mx-auto space-y-6 relative pb-12">
            <div className="flex flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Genres</h1>
                    <p className="text-slate-400 mt-1">Manage your genres here.</p>
                </div>

                <div>
                    <button onClick={()=>newGenreHandler()}
                        className="bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer">
                        Add Genre
                    </button>
                </div>

                <GenreDialog
                    open={open}
                    handleClose={handleClose}
                />

            </div>

            <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md overflow-hidden">
                <table className="w-full text-left border border-collapse">
                    <thead >
                        <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                            <th className="p-4 font-medium">ID</th>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium text-right mr-4">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {genres?.map((genre)=>(
                            <tr key={genre.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                <td className="p-4">{genre.id}</td>
                                <td className="p-4 text-white font-semibold">{genre.name}</td>
                                <td className="p-4 text-right">
                                    <div className="flex gap-3 justify-end">
                                        <EditGenreButton genre={genre}/>
                                        <DeleteGenreButton genre={genre} />

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </div>
    )
}