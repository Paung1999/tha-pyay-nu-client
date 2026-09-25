import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import * as React from 'react';
interface ConfirmDialogProps {
   open: boolean;
   handleClose: () => void;
   onConfirm: () => void;
   title: string;
   message: string;
}

export default function ConfrmDialog({title,open,handleClose,onConfirm,message}: ConfirmDialogProps) {

    const confirmHandler = () => {
        onConfirm();
        handleClose();
    }
    return (
        <React.Fragment>
            <Dialog

                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                       Cancle
                    </Button>
                    <Button onClick={confirmHandler} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>

    )
}