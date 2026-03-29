import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({children}: {children: React.ReactNode}){
    const token = localStorage.getItem("token");
    if(!token) {
        return <Navigate to="/admin/login" />
    
    }
    return children;

}