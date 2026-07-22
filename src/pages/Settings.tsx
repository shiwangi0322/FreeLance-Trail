// src/pages/Settings.jsx
import { useState } from "react";
import { User, Palette, Bell, ShieldCheck, CreditCard } from "lucide-react";

import ProfileSettings from "../components/settings/ProfileSettings";
import AppearanceSettings from "../components/settings/AppearanceSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import SecuritySettings from "../components/settings/SecuritySettings";
import BillingSettings from "../components/settings/BillingSettings";

// Swap for your real useAuthStore's `user` once wired up:
// import useAuthStore from "../store/authStore";
// const user = useAuthStore((s) => s.user);
const MOCK_USER = { name: "Aayush Mehta", email: "aayush@promanage.ai", role: "Founder" };

const TABS = [
    { key: "profile", label: "Profile", icon: User },
    { key: "appearance", label: "Appearance", icon: Palette },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: ShieldCheck },
    { key: "billing", label: "Billing", icon: CreditCard },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");

    // Swap each of these for real service calls once your backend is ready.
    async function handleSaveProfile(payload) {
        console.log("Save profile:", payload);
        await new Promise((r) => setTimeout(r, 400));
    }

    async function handleSaveNotifications(prefs) {
        console.log("Save notification prefs:", prefs);
        await new Promise((r) => setTimeout(r, 400));
    }

    async function handleChangePassword(payload) {
        console.log("Change password:", payload);
        await new Promise((r) => setTimeout(r, 400));
    }

    function handleUpgrade() {
        // Swap for a real Stripe/Razorpay checkout redirect.
        alert("Redirect to checkout / upgrade flow");
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Tab list */}
            <div className="lg:col-span-1">
                <div className="space-y-1 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
                    {TABS.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${isActive ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active section */}
            <div className="lg:col-span-3">
                {activeTab === "profile" && <ProfileSettings user={MOCK_USER} onSave={handleSaveProfile} />}
                {activeTab === "appearance" && <AppearanceSettings />}
                {activeTab === "notifications" && <NotificationSettings onSave={handleSaveNotifications} />}
                {activeTab === "security" && <SecuritySettings onChangePassword={handleChangePassword} />}
                {activeTab === "billing" && <BillingSettings currentPlan="free" onUpgrade={handleUpgrade} />}
            </div>
        </div>
    );
}