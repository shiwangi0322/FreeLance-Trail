import toast, { Toaster } from "react-hot-toast";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Toast
|--------------------------------------------------------------------------
|
| Same API as before (ToastProvider + showToast.success/error/loading/
| update/dismiss) — kept react-hot-toast rather than hand-rolling a
| toast system like the reference project does, since it already gives
| us stacking, auto-dismiss timers, and imperative show/update/dismiss
| for free. Only the VISUAL style changed: light colored backgrounds
| per type (green/red/amber/blue-50) instead of a dark slate-800 pill,
| matching the reference's toast look.
|
| Usage elsewhere in the app is unchanged:
|
|   import { showToast } from "../components/common/Toast";
|   showToast.success("Client added successfully");
|   showToast.error("Failed to save invoice");
|
*/

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 5000,
                style: {
                    fontSize: "14px",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                },
                success: {
                    style: {
                        background: "#f0fdf4", // green-50
                        border: "1px solid #bbf7d0", // green-200
                        color: "#166534", // green-800
                    },
                    iconTheme: { primary: "#22c55e", secondary: "#f0fdf4" },
                },
                error: {
                    style: {
                        background: "#fef2f2", // red-50
                        border: "1px solid #fecaca", // red-200
                        color: "#991b1b", // red-800
                    },
                    iconTheme: { primary: "#ef4444", secondary: "#fef2f2" },
                },
                loading: {
                    style: {
                        background: "#eff6ff", // blue-50
                        border: "1px solid #bfdbfe", // blue-200
                        color: "#1e40af", // blue-800
                    },
                },
            }}
        />
    );
}

export const showToast = {
    success(message) {
        return toast.success(message, {
            icon: <CheckCircle size={20} className="text-green-500" />,
        });
    },

    error(message) {
        return toast.error(message, {
            icon: <XCircle size={20} className="text-red-500" />,
        });
    },

    warning(message) {
        return toast(message, {
            icon: <AlertCircle size={20} className="text-amber-500" />,
            style: {
                background: "#fffbeb", // amber-50
                border: "1px solid #fde68a", // amber-200
                color: "#92400e", // amber-800
            },
        });
    },

    info(message) {
        return toast(message, {
            icon: <Info size={20} className="text-blue-500" />,
            style: {
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                color: "#1e40af",
            },
        });
    },

    loading(message) {
        return toast.loading(message);
    },

    /*
    | Updates a loading toast in place once an async action finishes, e.g.
    | the "Generate Documents" flow once Socket.IO delivers "doc:ready".
    */
    update(id, type, message) {
        toast[type](message, { id });
    },

    dismiss(id) {
        toast.dismiss(id);
    },
};