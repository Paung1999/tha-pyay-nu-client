import {apiSlice} from "../api/apiSlice.ts";
import type {LoginResponse, AuthResponse, RegisterInput} from "../../utils/ApiResponse.ts";

export const authApiSlice = apiSlice.injectEndpoints({
   endpoints:(builder)=>({
       login: builder.mutation<LoginResponse, {email:string, password: string}>({
           query:(credentials)=>({
               url: `/user/login`,
               method: 'POST',
               body: credentials
           })
       }),
       register: builder.mutation<AuthResponse , RegisterInput >({
            query:(credentials)=>({
                url: `/user/register`,
                method: 'POST',
                body: credentials
            })
       }),
       logout: builder.mutation({
           query:() => ({
               url: `/user/logout`,
               method: 'POST'
           })
       }),
       verifyMe: builder.query<AuthResponse,void>({
           query:()=> `user/verify`
       }),
       adminLogin: builder.mutation<AuthResponse, {email: string, password: string}>({
           query:(credentials) => ({
               url: `/admin/login`,
               method: 'POST',
               body: credentials
           })
       })
   })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useVerifyMeQuery,
    useAdminLoginMutation,
} = authApiSlice;