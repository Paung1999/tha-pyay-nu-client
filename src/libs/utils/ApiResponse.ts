import type {User} from "../../global/types.ts";

export interface ApiResponse <T>{
    message: string;
    data?: T;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export interface LoginResponse {
    message: string;
    user: User
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}