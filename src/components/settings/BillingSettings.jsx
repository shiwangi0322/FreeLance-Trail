// src/components/settings/BillingSettings.jsx
import { Check } from "lucide-react";

const PLAN_FEATURES = {
    free: ["Up to 5 clients", "Up to 10 projects", "Basic AI Assistant", "1 GB storage"],
    pro: ["Unlimited clients", "Unlimited projects", "Full AI Assistant + voice", "50 GB storage", "Priority support"],
};

/**
 * `currentPlan` is "free" | "pro". Swap onUpgrade for a real Stripe/Razorpay
 * checkout redirect once billing is wired up.
 */
export default function BillingSettings({ currentPlan = "free", onUpgrade }) {
    const isPro = currentPlan === "pro";

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Current Plan</h2>
                        <p className="mt-1 text-sm text-gray-400">
                            You're on the <span className="font-medium text-gray-700">{isPro ? "Pro" : "Free"}</span> plan.
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${isPro ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {isPro ? "PRO" : "FREE"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Free plan */}
                <div className={`rounded-2xl border-2 bg-white p-6 shadow-sm ${!isPro ? "border-violet-500" : "border-gray-100"}`}>
                    <p className="text-sm font-semibold text-gray-900">Free</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">₹0<span className="text-sm font-normal text-gray-400">/month</span></p>
                    <ul className="mt-4 space-y-2">
                        {PLAN_FEATURES.free.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check size={14} className="text-emerald-500" /> {f}
                            </li>
                        ))}
                    </ul>
                    {!isPro && (
                        <span className="mt-4 inline-block text-xs font-medium text-violet-600">Current plan</span>
                    )}
                </div>

                {/* Pro plan */}
                <div className={`rounded-2xl border-2 bg-white p-6 shadow-sm ${isPro ? "border-violet-500" : "border-gray-100"}`}>
                    <p className="text-sm font-semibold text-gray-900">Pro</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">₹999<span className="text-sm font-normal text-gray-400">/month</span></p>
                    <ul className="mt-4 space-y-2">
                        {PLAN_FEATURES.pro.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                                <Check size={14} className="text-emerald-500" /> {f}
                            </li>
                        ))}
                    </ul>
                    {isPro ? (
                        <span className="mt-4 inline-block text-xs font-medium text-violet-600">Current plan</span>
                    ) : (
                        <button
                            type="button"
                            onClick={onUpgrade}
                            className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700"
                        >
                            Upgrade to Pro
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}