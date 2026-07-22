import { useEffect } from "react";
import { X } from "lucide-react";

/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
|
| Same behavior as before (Escape to close, backdrop click to close,
| scroll lock while open) — restyled: backdrop now has blur, corners are
| rounded-xl instead of rounded-lg, and added a `size` prop (sm/md/lg/xl)
| since ClientModal/ProjectModal are compact but future modals (e.g. an
| invoice line-item editor) may need more width.
|
*/

const SIZE_STYLES = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    className={[
                        "relative w-full rounded-xl bg-white shadow-2xl transition-all",
                        SIZE_STYLES[size],
                    ].join(" ")}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                        <h2 id="modal-title" className="text-lg font-semibold text-slate-900">
                            {title}
                        </h2>
                        <button
                            type="button"
                            aria-label="Close"
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}