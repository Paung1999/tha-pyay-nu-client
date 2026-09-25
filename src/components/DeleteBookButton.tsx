import useDialog from "../hooks/useDialog.ts";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import {useMutation,useQueryClient} from "@tanstack/react-query";
// import {Button} from "@mui/material";
import {Trash} from 'lucide-react'

const api = "http://localhost:8800/api/v1/admin/books";

interface DeleteBookButtonProps {
    bookId: number;
}

export default function DeleteBookButton({bookId}:DeleteBookButtonProps) {
    const {open, setOpen, handleClose } = useDialog();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (bookId: number) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/${bookId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error("Fail to delete Book");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
            alert("Book deleted successfully");
        },
        onError: (error: any) => {
            alert(error.message);
        },
    });
    const handleShowDeleteDlg = () => {
        setOpen(true);
    }
    const deleteBookHandler = () => {
             deleteMutation.mutate(bookId);
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
            {/*<Button variant="contained"*/}
            {/*        type={"button"}*/}
            {/*        onClick={()=>handleShowDeleteDlg()}>*/}
            {/*    */}
            {/*</Button>*/}
            <div className="px-2 py-2 ">
                <Trash type={"button"} onClick={()=>handleShowDeleteDlg()} color="red"  cursor={"pointer"} />
            </div>
        </>



    )
}