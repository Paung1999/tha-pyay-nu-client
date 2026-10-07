import type {Genre} from "../global/types.ts";
import {Box, Button, Dialog, DialogContent, DialogTitle, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import {useSaveGenreMutation, useUpdateGenreByIdMutation} from "../libs/features/genre/genreApiSlice.ts";
import {useEffect} from "react";
import {useNotify} from "../providers/NotifyProvider.tsx";

interface GenreDialogProps {
    open: boolean;
    handleClose: () => void;
    GenreToEdit?: Genre
}
interface GenreFormData {
    name: string;
}

export default function GenreDialog({open, handleClose, GenreToEdit}: GenreDialogProps) {
    const isEditMode = !!GenreToEdit;
    const { register, handleSubmit,reset, formState: { errors } } = useForm<GenreFormData>({defaultValues:{name: GenreToEdit?.name??''}
    });

    const [updateGenreById] = useUpdateGenreByIdMutation();
    const [saveGenre] = useSaveGenreMutation();
    const notify = useNotify();

    useEffect(()=>{
        if(open){
            reset({name: GenreToEdit?.name ?? ''})
        }
    },[open,GenreToEdit, reset])

    const onSubmit = async (data: GenreFormData) => {
        try {
            if (isEditMode && GenreToEdit) {
                const genrePayload: Genre = { ...GenreToEdit, name: data.name };
                await updateGenreById(genrePayload).unwrap();
                notify?.success('Genre updated successfully.');
            } else {
                await saveGenre({ name: data.name }).unwrap();
                notify?.success('Genre saved successfully.');
            }
            handleClose();
        } catch (err) {
            console.error("Failed to save genre:", err);
            notify?.error('Failed to save genre ')
        }
    };

    const handleCancle = () => {
        handleClose();
    }
    return (
        <Dialog open={open} onClose={handleClose}  fullWidth={true} maxWidth="lg">
            <DialogTitle>
                {GenreToEdit ? 'Edit Genre': 'New Genre'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <TextField
                            label="name"
                            fullWidth
                            {...register('name')}
                            error={!!errors.name?.message}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' , px: 3, mt:2}}>
                        <Button type="button" onClick={handleCancle }>Cancel</Button>
                        <Button type="submit" variant="contained">Save</Button>
                    </Box>
                </form>

            </DialogContent>

        </Dialog>
    )
}