import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";

import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { showToast } from "../components/common/Toast";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
|
| Same shape as Login.jsx, with two differences:
|
| 1. registerSchema has more fields (name, confirmPassword) and uses
|    Zod's .refine() to cross-check that password === confirmPassword —
|    a validation rule that depends on TWO fields, so it can't live on
|    a single field's schema.
|
| 2. On success we log the user in immediately (most APIs return a token
|    on register, same as login) and send them straight to /dashboard —
|    no "from" redirect here, since nobody gets bounced to /register by
|    ProtectedRoute the way they do to /login.
|
*/

const registerSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().min(1, "Email is required").email("Enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"], // attaches the error to this specific field
    });

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    async function onSubmit(data) {
        try {
            // confirmPassword is only for client-side validation —
            // strip it before sending to the backend.
            const { confirmPassword, ...payload } = data;

            const { user, token } = await authService.register(payload);
            login(user, token);
            showToast.success("Account created successfully");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            const message =
                err.response?.data?.message ?? "Could not create account";
            showToast.error(message);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
                <h1 className="text-xl font-semibold text-slate-800">Create an account</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Start tracking your freelance work in minutes.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
                    <Input
                        label="Full name"
                        type="text"
                        placeholder="Jane Doe"
                        {...register("name")}
                        error={errors.name?.message}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="At least 8 characters"
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    <Input
                        label="Confirm password"
                        type="password"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                        error={errors.confirmPassword?.message}
                    />

                    <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
                        Create account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-slate-800 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}