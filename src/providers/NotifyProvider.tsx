import {useContext, createContext, useState, type ReactNode, useCallback, useMemo} from "react";
import {Alert , Snackbar, type AlertColor, type SnackbarCloseReason } from '@mui/material';

interface NotifyContextValues {
    success: (message: string) => void;
    error: (message: string) => void;
}

const NotifyContext = createContext<NotifyContextValues | null>(null)

export default function NotifyProvider({children}: {children: ReactNode}) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [severity, setSeverity] = useState<AlertColor>('success');

    const show = useCallback((msg: string, sev: AlertColor) => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    }, []);

    const value = useMemo(
        () => ({
            success: (msg: string) => show(msg, "success"),
            error: (msg: string) => show(msg, "error"),
        }),
        [show]
    );

    const handleClose = (_e?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") return;
        setOpen(false);
    };


    return(
        <NotifyContext.Provider value={value}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </NotifyContext.Provider>
    )
}

export function useNotify(){
    return useContext(NotifyContext);
}