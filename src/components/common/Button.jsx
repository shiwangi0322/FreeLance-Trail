import { Loader2 } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Button
|--------------------------------------------------------------------------
|
| Same props/behavior as before — variant, size, isLoading, disabled — just
| restyled to match the blue-accent design language (blue-600 primary,
| rounded-lg, shadow-sm on filled variants, 5 variants total).
|
|   <Button onClick={handleSave} isLoading={isSaving}>Save Client</Button>
|
*/

const VARIANT_STYLES = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500",
    outline: "border-2 border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-500",
    ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 shadow-sm",
};

const SIZE_STYLES = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    className = "",
    ...rest
}) {
    const isDisabled = disabled || isLoading;

    return (
        <button
            disabled={isDisabled}
            className={[
                "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                VARIANT_STYLES[variant],
                SIZE_STYLES[size],
                className,
            ].join(" ")}
            {...rest}
        >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {children}
        </button>
    );
}