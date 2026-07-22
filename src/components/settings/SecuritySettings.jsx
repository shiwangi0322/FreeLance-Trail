// src/components/settings/SecuritySettings.jsx
import { useState } from "react";
import { ShieldCheck, Monitor, Smartphone } from "lucide-react";

/**
 * Swap handleChangePassword for a real authService.changePassword(payload)
 * call once wired up. `sessions` is mock data — replace with a real
 * "active sessions" endpoint if your backend tracks device/session info.
 */
const MOCK_SESSIONS = [
    { id: 1, device: "Chrome on Windows", location: "Mumbai, India", lastActive: "Active now", icon: Monitor, isCurrent: true },
    { id: 2, device: "Claude App on iPhone", location: "Mumbai, India", lastActive: "2 days ago", icon: Smartphone, isCurrent: false },
];

export default function SecuritySettings({ onChangePassword }) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    async function handleSubmit() {
        setError("");
        if (newPassword.length < 8) {
            setError("New password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }
        setIsSaving(true);
        await onChangePassword?.({ currentPassword, newPassword });
        setIsSaving(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                    <ShieldCheck size={17} className="text-violet-600" />
                    Change Password
                </h2>
                <p className="mt-1 text-sm text-gray-400">Use a strong password you don't use elsewhere.</p>

                <div className="mt-5 grid grid-cols-1 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-medium text-gray-500">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                            />
                        </div>
                    </div>

                    {error && <p className="text-xs font-medium text-red-500">{error}</p>}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                    >
                        {isSaving ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900">Active Sessions</h2>
                <p className="mt-1 text-sm text-gray-400">Devices currently signed in to your account.</p>

                <ul className="mt-4 divide-y divide-gray-50">
                    {MOCK_SESSIONS.map((session) => {
                        const Icon = session.icon;
                        return (
                            <li key={session.id} className="flex items-center justify-between py-3">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                        <Icon size={16} />
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {session.device}
                                            {session.isCurrent && (
                                                <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                                                    This device
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-gray-400">{session.location} · {session.lastActive}</p>
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <button type="button" className="text-xs font-medium text-red-500 hover:text-red-600">
                                        Revoke
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}