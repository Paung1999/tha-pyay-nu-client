import {Box, Button, Dialog, DialogContent, DialogTitle} from "@mui/material";
import {CircleCheckBig} from "lucide-react";
import {useNavigate} from "react-router-dom";

interface CheckoutSuccessDialogProps {
    open: boolean;
    handleClose: () => void;
}

export default function CheckoutSuccessDialog({open, handleClose}:CheckoutSuccessDialogProps) {
    const navigate = useNavigate();

    const handleTrackOrder = () => {
        navigate('/orders');
        handleClose();
    }
    const handleGoToShopping = () => {
        navigate('/');
        handleClose();
    }

    return(
        <Dialog
            open={open}
            aria-labelledby="checkout-success-title"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: '16px',
                        p: 2,
                        width: '100%',
                        maxWidth: 360,
                    },
                },
            }}
        >
            <Box sx={{display: 'flex', justifyContent: 'center', pt: 2}}>
                <CircleCheckBig color="green" size={48} />
            </Box>

            <DialogTitle
                id="checkout-success-title"
                sx={{textAlign: 'center', fontSize: '2rem'}}
            >
                Success
            </DialogTitle>

            <DialogContent sx={{textAlign: 'center'}}>
                Order placed successfully
            </DialogContent>

            <Box sx={{p: 2, display: 'flex', flexDirection: 'column', gap: 1.5}}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleTrackOrder}
                    sx={{
                        backgroundColor: 'slateblue',
                        color: 'white',
                        borderRadius: '10px',
                        '&:hover': {backgroundColor: 'darkslateblue'},
                    }}
                >
                    Track Your Order
                </Button>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleGoToShopping}
                    sx={{
                        color: 'slateblue',
                        borderColor: 'slateblue',
                        borderRadius: '10px',
                        '&:hover': {borderColor: 'darkslateblue'},
                    }}
                >
                    Shopping
                </Button>
            </Box>
        </Dialog>
    );

}