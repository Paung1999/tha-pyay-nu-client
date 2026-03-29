import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useApp } from "../providers/AppProvider"

export default function Login(){
    const [loginError, setLoginError] = useState(false);
    const {setAuth} = useApp()!;
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm();

    const login = async(data:any) => {
        try{
            const res = await fetch(`http://localhost:8800/api/v1/user/login`,{
                method: "POST",
                headers: {
                    "content-type": "application/json",
                
                },
                body: JSON.stringify(data),

            });
            if(!res.ok){
                setLoginError(true)
                return false
            }

            const {user: loginUser , token} = await res.json();
            localStorage.setItem("token", token);
            const verifyRes = await fetch(`http://localhost:8800/api/v1/user/verify`,{
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,

                }
            });
            if(verifyRes.ok){
                const user = await verifyRes.json()
                setAuth(user);
                navigate("/");
                return true;
            }

        }catch(err: any){
            setLoginError(true);
        }
    }

    return(
    <div className="flex min-h-screen items-center justify-center bg-slate-900  p-4">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700 ">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-100">Welcome Back</h2>
                <p className="text-gray-400 mt-2">Please enter your details</p>
            </div>
            {loginError && <div className="text-red-500 text-center mt-2">Login failed</div>}

            <form onSubmit={handleSubmit(login)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-white ml-1">Enter your email</label>
                    <input type="email" {...register("email",{ required: "Email is required"} )} 
                        placeholder="youremail@gmail.com"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-white ml-1">Enter your password</label>
                    <input type="password" {...register("password", {required: "Password is required"})}
                        placeholder="password"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <button
                    type="submit"
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-lg  transform transition-active active:scale-[0.98] shadow-lg mt-2 cursor-pointer"
                >Sign in</button>
            </form>

            <p className="text-center text-gray-400 dark:text-gray-200 mt-8 text-sm">
                Don't have an account? <a href="/sign-up" className="text-white font-bold hover:underline">Sign Up</a>
            </p>
        </div>
      
    </div>
  )

}