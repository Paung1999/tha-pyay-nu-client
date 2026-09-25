import { ArrowLeft, BookIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation,useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect, } from "react";
import Loading from "../../components/Loading.tsx";


type BookToEdit = {
    id: number,
    title: string,
    author: string,
    coverImage: string,
    description: string,
    isbn?: string,
    language: string,
    genres: { id: number, name: string }[]
}


const api = "http://localhost:8800/api/v1/admin";


export default function EditBook(){
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { id } = useParams();
    const { register, handleSubmit, watch, reset, formState: { errors}} = useForm();
    const coverImageFile = watch("coverImage");
    const [previewUrl, setPreviewUrl] = useState<string | null >(null);

    useEffect(()=> {
        if(coverImageFile && coverImageFile.length > 0){
            const objectUrl = URL.createObjectURL(coverImageFile[0]);
            setPreviewUrl(objectUrl);
            return ()=> URL.revokeObjectURL(objectUrl);
        }
    },[coverImageFile])

    const { data: availableGenres = [], isLoading, isError} = useQuery({
        queryKey: ["genres"],
        queryFn: async()=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/genres`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`

                }
            });
            if(!res.ok){
                throw new Error("Failed to fetch genres");
            }
            return res.json();

        }
    });
    if(isLoading){
        return <Loading />;
    }
    if(isError){
        return (
            <div>
                something went wrong.
            </div>
        )
    }

    

    const {data: bookToEdit, isLoading: isBookLoading} = useQuery<BookToEdit>({
        queryKey: ["book", id ],
        queryFn: async()=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/books/${id}`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`

                }
            });
            if(!res.ok){
                throw new Error("Failed to fetch book");
            }
            return res.json();

        },
        enabled: !!id
    });
    if(isBookLoading){
        return <Loading />;
    }

    useEffect(() => {
        if (bookToEdit) {
            reset({
                title: bookToEdit.title,
                author: bookToEdit.author,
                description: bookToEdit.description,
                isbn: bookToEdit.isbn,
                language: bookToEdit.language,
                genres: bookToEdit.genres?.map((g: any) => String(g.id)) || []
            });
            if (bookToEdit.coverImage) {
                setPreviewUrl(bookToEdit.coverImage);
            }
        }
    }, [bookToEdit, reset]);

    const editBookMutation = useMutation({
        mutationFn: async (formData: FormData)=> {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/books/${id}`,{
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData
            
            });
            if(!res.ok){
                throw new Error("Failed to edit book");
            }
            return res.json();
        
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries({queryKey: ["books"]});
            alert("Book edited successfully");
            navigate("/admin/inventory");
        },
        onError: (error: any)=> {
            alert(error.message);
        }

    });

    const onSubmit = (data: any) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("author", data.author);
        formData.append("description", data.description);
        formData.append("language", data.language);
        if(data.isbn) formData.append("isbn", data.isbn);
        if (data.genres) {
            // Force it to be an array even if they only clicked one checkbox!
            const genresArray = Array.isArray(data.genres) ? data.genres : [data.genres];
            formData.append("genreId", JSON.stringify(genresArray));
        }
        if (data.coverImage && data.coverImage.length > 0) {
            formData.append("coverImage", data.coverImage[0]);
        }
        editBookMutation.mutate(formData);
    }
    

    
    return(
        <div className="max-w-4xl mx-auto space-y-6 relative pb-12">
            <div className="flex items-center gap-4">
                <button onClick={()=>navigate(-1)} className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookIcon size={20}/>
                        Edit Book
                    </h1>
                    <p className="text-slate-400 mt-1">Add a new book to your inventory.</p>
                </div>

            </div> 

            <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300" >Book Title</label>
                        <input type="text" {...register("title", {required: "Title is required"})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                         placeholder="e.g. The Lord of the Rings" />
                         {errors.title && <p className="text-red-400 text-xs mt-1">{String(errors.title.message)}</p> }

                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300" >Author Name</label>
                        <input type="text" {...register("author", {required: "Author is required"})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                         placeholder="Enter author name"  />
                         {errors.author && <p className="text-red-400 text-xs mt-1">{String(errors.author.message)}</p> }

                    </div>
                </div>

                <div className="space-y-2 mb-6">
                    <label className="text-sm font-medium text-slate-300">Description</label>
                    <textarea {...register("description", { required: "Description is required" })} rows={4} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600 resize-none"
                        placeholder="Enter book description..."  />
                    {errors.description && <p className="text-red-400 text-xs mt-1">{String(errors.description.message)}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300" >ISBN
                            <span className="text-slate-500 text-xs ml-1">(Optional)</span>
                        </label>
                        <input type="text" {...register("isbn")} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600"
                         placeholder="Enter ISBN"  />
                         {errors.isbn && <p className="text-red-400 text-xs mt-1">{String(errors.isbn.message)}</p> }

                    </div>
                    <div className="space-y-2">\
                        <label className="text-sm font-medium text-slate-300" >Language</label>
                        <select {...register("language", {required: "Language is required"})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" >
                            <option value="">Select a language</option>
                            <option value="Myanmar">Myanmar</option>
                            <option value="English">English</option>
                            <option value="French">French</option>
                        </select>
                         {errors.language && <p className="text-red-400 text-xs mt-1">{String(errors.language.message)}</p> }

                    </div>
                </div>

                <div className="space-y-3 mb-6">
                        <label className="text-sm font-medium text-slate-300">Genres *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            {availableGenres.map((genre: {id: number, name: string}) => (
                                <label key={genre.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input 
                                        type="checkbox"
                                        value={genre.id}
                                        {...register("genres", { required: "Select at least one genre" })}
                                        className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
                                        

                                    />
                                    <span className="text-slate-300 group-hover:text-white transition-colors">{genre.name}</span>
                                </label>
                            ))}
                        </div>
                        {errors.genres && <p className="text-red-400 text-xs mt-1">{String(errors.genres.message)}</p>}

                    </div>
                    <div className="space-y-2 mb-8">
                        <label className="text-sm font-medium text-slate-300">Cover Image *</label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            
                            {/* Upload Box */}
                            <div className="flex-1 w-full relative border-2 border-dashed border-slate-600 rounded-xl p-8 hover:bg-slate-700/30 transition-colors text-center cursor-pointer group hover:border-indigo-500/50">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    {...register("coverImage")}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"

                                />
                                <Upload className="mx-auto text-slate-400 mb-3 group-hover:text-indigo-400 transition-colors" size={32} />
                                <p className="text-base font-medium text-slate-300 group-hover:text-indigo-300 transition-colors">Click to upload cover art</p>
                                <p className="text-sm text-slate-500 mt-1">JPEG, PNG, or WEBP (Max 5MB)</p>
                            </div>

                            {/* Live Preview */}
                            {previewUrl && (
                                <div className="w-32 md:w-40 shrink-0 border border-slate-600 rounded-lg overflow-hidden shadow-lg bg-slate-900">
                                    <div className="text-xs text-center py-1 bg-slate-700 text-slate-300 font-medium">Preview</div>
                                    <img src={previewUrl} alt="Cover Preview" className="w-full aspect-[2/3] object-cover" />
                                </div>
                            )}
                        </div>
                        {errors.coverImage && <p className="text-red-400 text-xs mt-1">{String(errors.coverImage.message)}</p>}
                    </div>

                <div className="flex justify-end pt-4 border-t border-slate-700">
                    <button type="button" onClick={() => navigate("/admin/inventory")} className="px-6 py-2.5 text-slate-300 hover:text-white font-medium transition-colors mr-4 cursor-pointer">
                        Cancel
                    </button>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer">
                        Add Book
                    </button>
                </div>
            </form>

        </div>
    );


}