import type {Genre} from "../global/types.ts";
import useDialog from "../hooks/useDialog.ts";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import {Trash} from "lucide-react";
import {useDeleteGenreByIdMutation} from "../libs/features/genre/genreApiSlice.ts";
import {useNotify} from "../providers/NotifyProvider.tsx";

interface DeleteGenreButtonProps{
    genre: Genre;
}

export default function DeleteGenreButton({genre}:DeleteGenreButtonProps) {
    const {open, setOpen, handleClose} = useDialog();
    const [deleteGenreById] = useDeleteGenreByIdMutation();
    const notify = useNotify();

    const handleShowDeleteDlg = () => {
        setOpen(true);
    }
    const handleDeleteGenre = () => {
        deleteGenreById(genre);
        notify?.success('Deleted genre');
    }

    return(
        <>
            <ConfirmDialog
                open={open}
                title={"Delete Genre"}
                message={"Are you sure you want to delete this genre?"}
                onConfirm={handleDeleteGenre}
                handleClose={handleClose}
            />
            <div className="px-2 py-2 ">
                <button type="button" onClick={handleShowDeleteDlg} className="cursor-pointer">
                    <Trash color="red" />
                </button>
            </div>

        </>

    )

}