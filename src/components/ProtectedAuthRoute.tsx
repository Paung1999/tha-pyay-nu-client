import { Navigate } from "react-router-dom";

export default function ProtectedAuthRoute({children}: {children: React.ReactNode}){
    const token = localStorage.getItem("token");
    if(!token){
        return <Navigate to="/sign-in" />
    
    }
    return children;



}