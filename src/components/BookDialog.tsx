import type {CatalogBook} from "../global/types.ts";
import {useForm} from "react-hook-form";
import { Dialog, DialogContent, DialogTitle,} from "@mui/material";
import {Upload} from "lucide-react";
import {useGetAdminGenresQuery} from "../libs/features/genre/genreApiSlice.ts";
import {useEffect, useState} from "react";
import {useSaveAdminBookMutation, useUpdateInventoryBookByIdMutation} from "../libs/features/book/bookApiSlice.ts";
import {useNotify} from "../providers/NotifyProvider.tsx";

interface BookDialogProps{
    open: boolean;
    handleClose: () => void;
    bookToEdit?: CatalogBook
}
interface BookFormData {
    title: string,
    author: string,
    coverImage?: FileList,
    description: string,
    isbn?: string,
    language: string,
    genres?: string[]
}

const getDefaultValues = (book?: CatalogBook): BookFormData => ({
    title: book?.title ?? "",
    author: book?.author ?? "",
    description: book?.description ?? "",
    isbn: book?.isbn ?? "",
    language: book?.language ?? "",
    genres: book?.genres?.map(g => String(g.id)) ?? [],
});

export default function BookDialog({open, handleClose, bookToEdit}: BookDialogProps){
    const notify = useNotify();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: {errors}
    } = useForm<BookFormData>({defaultValues: getDefaultValues(bookToEdit)});

    const coverImageFile = watch('coverImage');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(()=>{
        if(coverImageFile && coverImageFile.length > 0){
            const objectUrl = URL.createObjectURL(coverImageFile[0]);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    },[coverImageFile]);

    // const displayedPreview = previewUrl ?? bookToEdit?.coverImage ?? null;

    const {data:availableGenres} = useGetAdminGenresQuery(undefined);
    const [updateBook] = useUpdateInventoryBookByIdMutation();
    const [saveBook] = useSaveAdminBookMutation()

    useEffect(()=>{
        if(open){
            reset(getDefaultValues(bookToEdit));
            setPreviewUrl(null);
        }
    },[open, bookToEdit, reset]);

    const onSubmit =async (data:BookFormData) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('author', data.author);
        formData.append('description', data.description);
        formData.append('language', data.language);
        if(data.isbn){
            formData.append('isbn', data.isbn);
        }
        if (data.genres) {
            // Force it to be an array even if they only clicked one checkbox!
            const genresArray = Array.isArray(data.genres) ? data.genres : [data.genres];
            formData.append("genreId", JSON.stringify(genresArray));
        }
        if(data.coverImage && data.coverImage.length > 0){
            formData.append('coverImage', data.coverImage[0]);
        }

        if(bookToEdit){
            updateBook({id: bookToEdit.id, body: formData});
            notify?.success('Book updated successfully.');
        }else{
            saveBook(formData);
            notify?.success('Book saved successfully.');
        }
        handleClose()
    }

    const handleCancle = () => {
        reset(getDefaultValues(bookToEdit));
        handleClose();
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="lg">
            <DialogTitle>
                {bookToEdit? 'Edit' : 'New Book'}
            </DialogTitle>
            <DialogContent>
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
                            {availableGenres?.map((genre: {id: number, name: string}) => (
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
                                    <img src={previewUrl}  alt="Cover Preview" className="w-full aspect-[2/3] object-cover" />
                                </div>
                            )}
                        </div>
                        {errors.coverImage && <p className="text-red-400 text-xs mt-1">{String(errors.coverImage.message)}</p>}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-700">
                        <button type="button" onClick={ handleCancle} className="px-6 py-2.5 text-slate-300 hover:text-white font-medium transition-colors mr-4 cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20 cursor-pointer">
                            {bookToEdit? 'Update Book' : 'Add Book'}
                        </button>
                    </div>
                </form>

            </DialogContent>

        </Dialog>
    )
}