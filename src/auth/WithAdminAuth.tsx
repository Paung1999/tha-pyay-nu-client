import {useAppSelector} from "../app/hooks.ts";
import {selectAuthInitialized, selectIsAuthenticated} from "../libs/features/auth/authSlice.ts";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function WithAdminAuth(Component:any){
    return function AdminAuthComponent(props:any){
        const isAuthenticated = useAppSelector(selectIsAuthenticated);
        const isInitialized = useAppSelector(selectAuthInitialized);
        const navigate = useNavigate();

        console.log({ isInitialized, isAuthenticated });

        useEffect(() => {
            if(isInitialized && !isAuthenticated){
                navigate('/admin/login')
            }

        },[isAuthenticated,isInitialized, navigate]);

        if(!isInitialized){
            return null;
        }
        if(!isAuthenticated){
            return null;
        }
        return <Component {...props} />;
    }
}