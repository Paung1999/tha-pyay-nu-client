import {useAppDispatch} from "../app/hooks.ts";
import {useVerifyMeQuery} from "../libs/features/auth/authApiSlice.ts";
import {useEffect} from "react";
import {logoutAction, setAuthInitialized, setCredentials} from "../libs/features/auth/authSlice.ts";

export default function AuthInitializer({children}:{children:React.ReactNode}) {
    const dispatch = useAppDispatch();
    const {data, isLoading , isError} = useVerifyMeQuery();

    useEffect(()=>{
        if(data?.user){
            dispatch(setCredentials(data?.user))
        }else if(isError){
            dispatch(logoutAction())
        }
        if(!isLoading){
            dispatch(setAuthInitialized())
        }
    },[data,dispatch, isLoading, isError]);

    return children;

}