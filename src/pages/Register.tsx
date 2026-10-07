import { useForm } from "react-hook-form";
import { useNavigate } from  "react-router-dom";
import {useRegisterMutation} from "../libs/features/auth/authApiSlice.ts";


interface RegisisterFormdata{
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
}

export default function Register(){
    const navigate =  useNavigate();
    const [registerUser ] = useRegisterMutation();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisisterFormdata>();

    const registerNewUser = async(data: RegisisterFormdata)=> {
        try{
            await registerUser(data).unwrap();
            navigate('/sign-in')

        }catch(err){
            console.log(err);
        }
    }

    return(
        <div className="flex  min-h-[calc(100vh-4rem)] items-center justify-center  px-4 py-8 sm:py-16">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-700 ">
            <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">Welcome Back</h2>
                <p className="text-gray-400 mt-2">Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit(registerNewUser)} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-200 ml-1">Enter your name</label>
                    <input type="text" {...register("name",{ required: "Email is required"} )} 
                        placeholder="Your Name"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-200 ml-1">Enter your email</label>
                    <input type="email" {...register("email",{ required: "Email is required"} )} 
                        placeholder="youremail@gmail.com"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-200 ml-1">Enter your password</label>
                    <input type="password" {...register("password", {required: "Password is required"})}
                        placeholder="password"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-200 ml-1">Confirm your password</label>
                    <input type="password" {...register("confirmPassword", {required: "Confirm password is required"})}
                        placeholder="password"
                        className="w-full px-4 py-3 rounded-lg text-white bg-slate-900/50 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>
                {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                <button
                    type="submit"
                    className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-3 rounded-lg  transform transition-active active:scale-[0.98] shadow-lg mt-2 cursor-pointer"
                >Sign Up</button>
            </form>

            <p className="text-center text-gray-400 dark:text-gray-200 mt-8 text-sm">
                Already have an account?<a href="/sign-in" className="text-white font-bold hover:underline">Sign In</a>
            </p>
        </div>
      
    </div>
    )

}