import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import type { Genre } from "../../global/types";
import Loading from "../../components/Loading";
import { Trash2, SquarePen } from "lucide-react";
import { useNavigate } from "react-router-dom";



const api = "http://localhost:8800/api/v1/admin";

export default function Genres(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {data: genres, isLoading, isError} = useQuery<Genre[]>({
        queryKey: ["genres"],
        queryFn: async() => {
            const token = localStorage.getItem("token");

            const res = await fetch(`${api}/genres`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if(!res.ok){
                if (res.status === 401) throw new Error("Unauthorized: Please log in again");
                throw new Error("Failed to fetch genres");
            }
            return res.json();
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async(genreId: number) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/genres/${genreId}`,{
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`

                }
            });
            if(!res.ok){
                throw new Error("Failed to delete genre");

            }
           

        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["genres"]});
            alert("Genre deleted successfully");
        },
        onError: (error)=> {
            alert(error.message);
        }
    })

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
                    <button onClick={()=>navigate("/admin/genres/add-genre")}
                        className="bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer">
                        Add Genre
                    </button>
                </div>

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
                                        <button className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer mr-3">
                                            <SquarePen size={20} />
                                        </button>
                                        <button onClick={()=>deleteMutation.mutate(genre.id)} 
                                        className="text-red-700 hover:text-red-800 transition-colors cursor-pointer mr-3">
                                            <Trash2 size={20} />
                                        </button>

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