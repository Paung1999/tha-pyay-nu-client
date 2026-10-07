import useDialog from "../hooks/useDialog.ts";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import {Trash} from 'lucide-react'
import {useDeleteInventoryBookByIdMutation} from "../libs/features/book/bookApiSlice.ts";
import type {CatalogBook} from "../global/types.ts";
import {useNotify} from "../providers/NotifyProvider.tsx";


interface DeleteBookButtonProps {
    book: CatalogBook
}

export default function DeleteBookButton({book}:DeleteBookButtonProps) {
    const {open, setOpen, handleClose } = useDialog();
    const [deleteBook ] = useDeleteInventoryBookByIdMutation();
    const notify = useNotify();

    const handleShowDeleteDlg = () => {
        setOpen(true);
    }
    const deleteBookHandler = () => {
             deleteBook(book);
             notify?.success('Deleted book');
             handleClose();
    }

    return (
        <>
            <ConfirmDialog
                open={open}
                title="Delete Book"
                message="Are you sure you want to delete this book?"
                onConfirm={deleteBookHandler}
                handleClose={handleClose}
            />
            <div className="px-2 py-2 ">
                <Trash type={"button"} onClick={()=>handleShowDeleteDlg()} color="red"  cursor={"pointer"} />
            </div>
        </>



    )
}