import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import {useLoginMutation} from "../libs/features/auth/authApiSlice.ts";
import {useAppDispatch} from "../app/hooks.ts";
import {setCredentials} from "../libs/features/auth/authSlice.ts";

interface LoginFormData{
    email: string,
    password: string,
}

export default function Login(){

    const [login] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm<LoginFormData>();

    const onSubmit = async(data:LoginFormData) => {
        try{
            const result = await login(data).unwrap();
            dispatch(setCredentials(result.user));
            navigate("/");

        }catch(err){
            console.log(err)
        }
    }


    return(
    <div className="flex  min-h-[calc(100vh-4rem)] items-center justify-center  px-4 py-8 sm:py-16">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700
                p-6 sm:p-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Welcome Back</h2>
                <p className="text-gray-400 mt-2">Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-white ml-1">Enter your email</label>
                    <input type="email" {...register("email",{ required: "Email is required"} )} 
                        placeholder="youremail@gmail.com"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-white ml-1">Enter your password</label>
                    <input type="password" {...register("password", {required: "Password is required"})}
                        placeholder="password"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>

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