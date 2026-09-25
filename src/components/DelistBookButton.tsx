import useDialog from "../hooks/useDialog.ts";
import ConfirmDialog from "../components/ConfirmDialog.tsx";
import {Trash} from "lucide-react";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const api = "http://localhost:8800/api/v1/admin";

interface DelistBookButtonProps{
    bookId:number;
}

export default function DelistBookButton({bookId}:DelistBookButtonProps) {
    const {open, setOpen, handleClose } = useDialog();
    const queryClient = useQueryClient();

    const removeMutation = useMutation({
        mutationFn: async (bookId: number) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/sell-books/${bookId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error(`Failed to delete ${bookId}`);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["books"] });
            alert(`Removed from listing successfully`);
        },
        onError: (error: any) => {
            alert(error.message);
        },
    });

    const handleShowDelistDlg = () => {
        setOpen(true);
    }
    const delistBookHandler = () => {
        removeMutation.mutate(bookId);
    }


    return (
        <>
            <ConfirmDialog
                open={open}
                title={'Delisting Book'}
                message={'Are you sure you want to delist this book?'}
                onConfirm={delistBookHandler}
                handleClose={handleClose}
            />
            <div className="px-2 py-2 ">
                <Trash type={"button"} onClick={()=>handleShowDelistDlg()} color="red"  cursor={"pointer"} />
            </div>
        </>
    )
}
