import {useState} from "react";


function useDialog(){
    const [open,setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    }
    return {
        open,
        setOpen,
        handleClose,
    }
}

export default useDialog;