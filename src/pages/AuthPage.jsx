import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { showToast } from "../components/common/Toast";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

/*
|--------------------------------------------------------------------------
| AuthPage
|--------------------------------------------------------------------------
|
| Replaces the separate Login.jsx / Register.jsx pages with ONE component
| that renders both forms and slides a colored overlay panel across to
| reveal whichever one is active — the classic "sliding card" auth
| pattern. It only really works as a single component since both forms
| + the overlay share one animated container.
|
| Routing: both /login and /register point here (update AppRoutes.jsx
| to route both paths to <AuthPage />). Initial mode is read from the
| URL on mount; toggling calls navigate() so the URL stays in sync and
| the browser back button still works, without a full page reload.
|
| Kept from the original Login/Register: React Hook Form + Zod
| validation, authService.login/register calls, useAuth().login() to
| populate authStore, redirect-to-original-destination on sign in, and
| the dev-only backend bypass (gated behind import.meta.env.DEV).
|
| Social buttons are visual only for now — TODO(later): wire to your
| backend's OAuth routes once they exist (e.g. GET /api/auth/google →
| Google consent screen → backend callback → issues your own JWT same
| as email/password login).
|
*/

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

const registerSchema = z
    .object({
        name: z.string().min(1, "Name is required"),
        email: z.string().min(1, "Email is required").email("Enter a valid email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

// Simple letter-badge icons for Google/Facebook — avoids reproducing the
// exact trademarked logo artwork while still reading as "social login."
function SocialButton({ children, label }) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
        >
            {children}
        </button>
    );
}

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [isSignUp, setIsSignUp] = useState(location.pathname === "/register");
    const [showPassword, setShowPassword] = useState(false);

    // Keep local animation state in sync if the URL changes some other way
    // (browser back/forward, or a direct link to /register).
    useEffect(() => {
        setIsSignUp(location.pathname === "/register");
    }, [location.pathname]);

    function switchToSignUp() {
        navigate("/register");
    }

    function switchToSignIn() {
        navigate("/login");
    }

    /* ---------------------------------------------------------------- */
    /* Sign In form                                                       */
    /* ---------------------------------------------------------------- */
    const signInForm = useForm({ resolver: zodResolver(loginSchema) });

    const redirectTo = location.state?.from?.pathname ?? "/dashboard";

    async function onSignIn(data) {
        try {
            const { user, token } = await authService.login(data);
            login(user, token);
            showToast.success("Login successful");
            navigate(redirectTo, { replace: true });
        } catch (err) {
            showToast.error(err.response?.data?.message ?? "Invalid email or password");
        }
    }

    function handleDevBypass() {
        login(
            { id: "dev-user-1", name: "Dev User", email: "dev@example.com" },
            "dev-fake-token"
        );
        showToast.success("Dev bypass — logged in without backend");
        navigate(redirectTo, { replace: true });
    }

    /* ---------------------------------------------------------------- */
    /* Sign Up form                                                       */
    /* ---------------------------------------------------------------- */
    const signUpForm = useForm({ resolver: zodResolver(registerSchema) });

    async function onSignUp(data) {
        try {
            const { confirmPassword, ...payload } = data;
            const { user, token } = await authService.register(payload);
            login(user, token);
            showToast.success("Account created successfully");
            navigate("/dashboard", { replace: true });
        } catch (err) {
            showToast.error(err.response?.data?.message ?? "Could not create account");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-200 to-purple-200 p-4">
            <div className="relative h-[560px] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900">
                {/* ------------------------------------------------------------ */}
                {/* Sign In form panel — sits on the LEFT half, hides when       */}
                {/* isSignUp so it doesn't overlap the Sign Up panel underneath  */}
                {/* ------------------------------------------------------------ */}
                <div
                    className={[
                        "absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out",
                        isSignUp ? "translate-x-full opacity-0" : "translate-x-0 opacity-100",
                    ].join(" ")}
                >
                    <form
                        onSubmit={signInForm.handleSubmit(onSignIn)}
                        className="flex h-full flex-col items-center justify-center gap-3 px-10"
                    >
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sign In</h1>

                        <div className="flex gap-3">
                            <SocialButton label="Sign in with Google">
                                <span className="text-sm font-bold text-red-500">G</span>
                            </SocialButton>
                            <SocialButton label="Sign in with Facebook">
                                <span className="text-sm font-bold text-blue-600">f</span>
                            </SocialButton>
                            <SocialButton label="Sign in with GitHub">
                                <span className="text-sm font-bold text-slate-800">Gh</span>
                            </SocialButton>
                            <SocialButton label="Sign in with LinkedIn">
                                <span className="text-sm font-bold text-blue-700">in</span>
                            </SocialButton>
                        </div>

                        <p className="text-xs text-slate-400">or use your email password</p>

                        <div className="w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                {...signInForm.register("email")}
                                className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-slate-800 dark:text-slate-100"
                            />
                            {signInForm.formState.errors.email && (
                                <p className="mt-1 text-xs text-red-600">
                                    {signInForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...signInForm.register("password")}
                                className="w-full rounded-lg bg-slate-100 px-4 py-3 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-slate-800 dark:text-slate-100"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {signInForm.formState.errors.password && (
                            <p className="w-full text-left text-xs text-red-600">
                                {signInForm.formState.errors.password.message}
                            </p>
                        )}

                        <button
                            type="button"
                            className="self-end text-xs font-medium text-purple-600 hover:underline"
                        >
                            Forgot Your Password?
                        </button>

                        <button
                            type="submit"
                            disabled={signInForm.formState.isSubmitting}
                            className="mt-2 w-full rounded-lg bg-purple-700 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-purple-800 disabled:opacity-60"
                        >
                            {signInForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
                        </button>

                        {import.meta.env.DEV && (
                            <button
                                type="button"
                                onClick={handleDevBypass}
                                className="w-full rounded-lg border border-amber-300 bg-amber-50 py-2 text-xs font-medium text-amber-800 hover:bg-amber-100"
                            >
                                ⚠ Dev only: Preview without backend
                            </button>
                        )}
                    </form>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* Sign Up form panel — mirrors the Sign In panel, sits on the  */}
                {/* RIGHT half, slides into view when isSignUp is true            */}
                {/* ------------------------------------------------------------ */}
                <div
                    className={[
                        "absolute top-0 h-full w-1/2 transition-all duration-700 ease-in-out",
                        isSignUp ? "translate-x-full opacity-100" : "translate-x-[200%] opacity-0",
                    ].join(" ")}
                >
                    <form
                        onSubmit={signUpForm.handleSubmit(onSignUp)}
                        className="flex h-full flex-col items-center justify-center gap-2.5 px-10"
                    >
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Create Account</h1>

                        <div className="flex gap-3">
                            <SocialButton label="Sign up with Google">
                                <span className="text-sm font-bold text-red-500">G</span>
                            </SocialButton>
                            <SocialButton label="Sign up with Facebook">
                                <span className="text-sm font-bold text-blue-600">f</span>
                            </SocialButton>
                            <SocialButton label="Sign up with GitHub">
                                <span className="text-sm font-bold text-slate-800">Gh</span>
                            </SocialButton>
                            <SocialButton label="Sign up with LinkedIn">
                                <span className="text-sm font-bold text-blue-700">in</span>
                            </SocialButton>
                        </div>

                        <p className="text-xs text-slate-400">or use your email for registration</p>

                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Name"
                                {...signUpForm.register("name")}
                                className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-slate-800 dark:text-slate-100"
                            />
                            {signUpForm.formState.errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {signUpForm.formState.errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <input
                                type="email"
                                placeholder="Email"
                                {...signUpForm.register("email")}
                                className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-slate-800 dark:text-slate-100"
                            />
                            {signUpForm.formState.errors.email && (
                                <p className="mt-1 text-xs text-red-600">
                                    {signUpForm.formState.errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <input
                                type="password"
                                placeholder="Password"
                                {...signUpForm.register("password")}
                                className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-slate-800 dark:text-slate-100"
                            />
                            {signUpForm.formState.errors.password && (
                                <p className="mt-1 text-xs text-red-600">
                                    {signUpForm.formState.errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Reference screenshot only shows Name/Email/Password — no
                confirm-password field. Kept it here anyway since it's
                a meaningful safety check (catches typos before they lock
                someone out of a brand-new account); delete this block if
                you want to match the reference exactly. */}
                        <div className="w-full">
                            <input
                                type="password"
                                placeholder="Confirm password"
                                {...signUpForm.register("confirmPassword")}
                                className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-slate-800 dark:text-slate-100"
                            />
                            {signUpForm.formState.errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-600">
                                    {signUpForm.formState.errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={signUpForm.formState.isSubmitting}
                            className="mt-2 w-full rounded-lg bg-purple-700 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-purple-800 disabled:opacity-60"
                        >
                            {signUpForm.formState.isSubmitting ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>
                </div>

                {/* ------------------------------------------------------------ */}
                {/* Overlay — the curved colored panel with "Hello, Friend!" /   */}
                {/* "Welcome Back!" copy. Slides opposite direction to the forms */}
                {/* to always cover whichever form is currently inactive.        */}
                {/* Curve approximated via a large one-sided border-radius — not */}
                {/* a pixel-perfect blob shape, but reads the same visually.     */}
                {/* ------------------------------------------------------------ */}
                <div
                    className={[
                        "absolute top-0 h-full w-1/2 bg-linear-to-br from-purple-600 to-purple-800 text-white transition-all duration-700 ease-in-out",
                        isSignUp ? "left-0 rounded-r-[120px]" : "left-1/2 rounded-l-[120px]",
                    ].join(" ")}
                >
                    <div className="flex h-full flex-col items-center justify-center gap-4 px-10 text-center">
                        {isSignUp ? (
                            <>
                                <h2 className="text-2xl font-bold">Welcome Back!</h2>
                                <p className="text-sm text-purple-100">
                                    Enter your personal details to use all of site features
                                </p>
                                <button
                                    type="button"
                                    onClick={switchToSignIn}
                                    className="rounded-lg border-2 border-white px-8 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-white hover:text-purple-700"
                                >
                                    Sign In
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold">Hello, Friend!</h2>
                                <p className="text-sm text-purple-100">
                                    Register with your personal details to use all of site
                                    features
                                </p>
                                <button
                                    type="button"
                                    onClick={switchToSignUp}
                                    className="rounded-lg border-2 border-white px-8 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-white hover:text-purple-700"
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}