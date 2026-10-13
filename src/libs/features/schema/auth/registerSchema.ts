import {z} from "zod"

export const registerSchema = z.object({
    name: z.string().min(3,'Name must be at least 3 characters').max(50, 'Name must be at most 50 characters'),
    email: z.string().email(),
    password: z.string().min(6,'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;