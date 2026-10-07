import type {Genre} from "../global/types.ts";
import GenreDialog from "./GenreDialog.tsx";
import useDialog from "../hooks/useDialog.ts";
import {SquarePen} from "lucide-react";

interface EditGenreButtonProps{
    genre: Genre
}

export default function EditGenreButton({genre}: EditGenreButtonProps){
    const {open, setOpen, handleClose} = useDialog();

    return (
        <>
            <GenreDialog
                open={open}
                handleClose={handleClose}
                GenreToEdit={genre}
            />
            <button
                onClick={()=> setOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer mr-3">
                <SquarePen size={20} />
            </button>
        </>
    )
}