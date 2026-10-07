import { Navigate } from "react-router-dom";
import {useAppSelector} from "../app/hooks.ts";
import {selectUser} from "../libs/features/auth/authSlice.ts";

export default function ProtectedAdminRoute({children}: {children: React.ReactNode}){
    const admin = useAppSelector(selectUser)?.role === 'ADMIN';
    if(!admin) {
        return <Navigate to="/admin/login" />
    
    }
    return children;

}