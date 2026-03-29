import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const api = "http://localhost:8800/api/v1/admin";

export default function AddGenre(){
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }} = useForm();

    const addGenreMutation = useMutation({
        mutationFn: async (genreData: any) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/genres`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`

                },
                body: JSON.stringify(genreData)
            });
            if(!res.ok){
                throw new Error("Failed to add genre");
            
            }
            return res.json();
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["genres"]});
            alert("Genre added successfully");
            navigate("/admin/genres");

        },
        onError: (error: any) => {
            alert(error.message);
        }
    });

    const onSubmit = (data:any)=> {
        const genreData = {
            name: data.name
        }
        addGenreMutation.mutate(genreData);
    }

    return(
        <div className="max-w-4xl mx-auto space-y-6 relative pb-12">
           <div className="flex flex-row items-center gap-3">
                <button onClick={()=>navigate(-1)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white">Add Genre</h1>
                    <p className="text-slate-400 mt-1">Add a new genre to your inventory.</p>
                </div>

           </div>

           <form  onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden p-8">
                <div className="p-8 space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300" >Genre Name</label>
                        <input  type="text" {...register("name",{required: "Genre name is required"} )} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                            placeholder="Enter genre name" />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-700">
                    <button type="button" onClick={() => navigate("/admin/genres")} className="px-6 py-2.5 text-slate-300 hover:text-white font-medium transition-colors mr-4 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer">
                        Save
                    </button>
                </div>

           </form>
        </div>
    )
}