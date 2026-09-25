import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useApp } from "../../providers/AppProvider"
import { ShieldCheck } from "lucide-react"



export default function AdminLogin(){
    const [loginError, setLoginError] = useState(false);
    const { setAdminAuth } = useApp()!;
    const navigate = useNavigate();
    const {register,handleSubmit, formState: {errors} } = useForm();

    const adminLogin = async(data: any)=> {
        try{
            const res = await fetch(`http://localhost:8800/api/v1/admin/login`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)

            });
            if(!res.ok){
                setLoginError(true);
                return false;
            }
            const { token} = await res.json();
            localStorage.setItem("token", token);
            const verifyRes = await fetch(`http://localhost:8800/api/v1/admin/verify`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }

            });
            if(verifyRes.ok){
                const loginAdmin = await verifyRes.json();
                setAdminAuth(loginAdmin);
                navigate("/admin");
                return true;
                
            }


        }catch(err:any){
            setLoginError(true);
        }
    }

    return(
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck className="w-8 h-8 text-indigo-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Access</h1>
                    <p className="text-slate-400 mt-2">Authenticate to access the dashboard</p>
                </div>

                {loginError && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        Invalid credentials. Access denied.
                    </div>
                )}

                <form onSubmit={handleSubmit(adminLogin)} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            {...register("email", { required: "Email is required" })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600 transition-all"
                            placeholder="admin@example.com"
                            autoComplete="off"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{String(errors.email.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                            Password
                        </label>
                        <input 
                            type="password" 
                            {...register("password", { required: "Password is required" })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-600 transition-all"
                            placeholder="••••••••••••"
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{String(errors.password.message)}</p>}
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 mt-2"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate("/")} 
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        ← Return to Store
                    </button>
                </div>
            </div>
        </div>
    )
}