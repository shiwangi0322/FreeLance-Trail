// src/components/settings/ProfileSettings.jsx
import { useState } from "react";
import { Camera } from "lucide-react";

/**
 * `user` shape: { name, email, role, avatarUrl }. Swap handleSave for a
 * real authService.updateProfile(payload) call once wired up — kept as
 * local state here so the page works before that endpoint exists.
 */
export default function ProfileSettings({ user, onSave }) {
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [role, setRole] = useState(user?.role ?? "");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSave() {
        setIsSaving(true);
        await onSave?.({ name, email, role });
        setIsSaving(false);
    }

    const initials = name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Profile</h2>
            <p className="mt-1 text-sm text-gray-400">Update your personal details and photo.</p>

            <div className="mt-5 flex items-center gap-4">
                <div className="relative">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-lg font-semibold text-white">
                        {initials || "?"}
                    </span>
                    <button
                        type="button"
                        className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white hover:bg-gray-700"
                        aria-label="Change photo"
                    >
                        <Camera size={13} />
                    </button>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-900">{name || "Your Name"}</p>
                    <p className="text-xs text-gray-400">JPG or PNG, max 2MB</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-xs font-medium text-gray-500">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-500">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Role / Title</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Studio Owner, Freelance Designer"
                        className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}