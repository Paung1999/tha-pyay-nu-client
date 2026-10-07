import { Navigate } from "react-router-dom";
import {selectUser} from "../libs/features/auth/authSlice.ts";
import {useAppSelector} from "../app/hooks.ts";

export default function ProtectedAuthRoute({children}: {children: React.ReactNode}){
    const user = useAppSelector(selectUser);
    if(!user){
        return <Navigate to="/sign-in" />
    
    }
    return children;



}