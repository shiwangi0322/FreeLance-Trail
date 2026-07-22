import { Loader2 } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Spinner
|--------------------------------------------------------------------------
|
| Same props as before (size, fullPage, label) — restyled to blue-600
| (matching the primary accent color) instead of slate-500.
|
*/

const SIZE_MAP = {
    sm: 16,
    md: 24,
    lg: 32,
};

export default function Spinner({ size = "md", fullPage = false, label }) {
    const spinner = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 size={SIZE_MAP[size]} className="animate-spin text-blue-600" />
            {label && <p className="text-sm text-slate-500">{label}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                {spinner}
            </div>
        );
    }

    return spinner;
}