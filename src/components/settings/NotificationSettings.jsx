// src/components/settings/NotificationSettings.jsx
import { useState } from "react";

const DEFAULT_PREFS = [
    { key: "newInvoicePaid", label: "Invoice paid", description: "When a client pays an invoice." },
    { key: "invoiceOverdue", label: "Invoice overdue", description: "When an invoice passes its due date." },
    { key: "projectDeadline", label: "Upcoming deadlines", description: "Reminders 3 days before a project deadline." },
    { key: "newClientAdded", label: "New client added", description: "When a new client is added to your workspace." },
    { key: "aiSuggestions", label: "AI suggestions", description: "Proactive tips from the AI Assistant." },
    { key: "weeklyDigest", label: "Weekly summary email", description: "A recap of activity every Monday morning." },
];

function Toggle({ checked, onChange }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-violet-600" : "bg-gray-200"}`}
        >
            <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"
                    }`}
            />
        </button>
    );
}

/**
 * `initialPrefs` shape: { [key]: boolean }. Swap onSave for a real
 * userService.updateNotificationPrefs(prefs) call once wired up.
 */
export default function NotificationSettings({ initialPrefs = {}, onSave }) {
    const [prefs, setPrefs] = useState(() =>
        DEFAULT_PREFS.reduce((acc, item) => {
            acc[item.key] = initialPrefs[item.key] ?? true;
            return acc;
        }, {})
    );
    const [isSaving, setIsSaving] = useState(false);

    function toggle(key) {
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    }

    async function handleSave() {
        setIsSaving(true);
        await onSave?.(prefs);
        setIsSaving(false);
    }

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm text-gray-400">Choose what you want to be notified about.</p>

            <ul className="mt-5 divide-y divide-gray-50">
                {DEFAULT_PREFS.map((item) => (
                    <li key={item.key} className="flex items-center justify-between py-3">
                        <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                        <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
                    </li>
                ))}
            </ul>

            <div className="mt-6 flex justify-end">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60"
                >
                    {isSaving ? "Saving..." : "Save Preferences"}
                </button>
            </div>
        </div>
    );
}