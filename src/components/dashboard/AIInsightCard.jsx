import robot from "../../assets/images/robotimg.png";

export default function AIInsightCard({
    overdueCount,
    overdueAmount,
    onSendReminders,
}) {
    return (
        <div
            className="
            relative overflow-hidden rounded-3xl p-6 h-62.5
            bg-linear-to-br
            from-purple-50 via-violet-100 to-indigo-100
            dark:from-[#1B1D36]
            dark:via-[#23264A]
            dark:to-[#2D2358]
            border border-transparent
            dark:border-purple-500/20
            "
        >
            {/* Glow */}
            <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-purple-300/30 dark:bg-purple-500/20 blur-3xl"></div>

            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-violet-300/30 dark:bg-indigo-500/10 blur-3xl"></div>

            {/* Text */}
            <div className="relative z-10 max-w-[60%]">
                <h3 className="text-xl font-bold text-violet-700 dark:text-purple-400">
                    AI Insight
                </h3>

                <p className="mt-3 leading-relaxed text-gray-700 dark:text-gray-200">
                    You have{" "}
                    <span className="font-semibold">{overdueCount}</span>{" "}
                    overdue invoices worth{" "}
                    <span className="font-semibold">
                        ₹{overdueAmount}
                    </span>
                    . Consider sending reminders.
                </p>

                <button
                    onClick={onSendReminders}
                    className="
                    mt-5 rounded-xl px-5 py-3 font-medium shadow-md
                    transition duration-300 hover:scale-105
                    bg-white text-gray-900
                    dark:bg-purple-600 dark:text-white
                    dark:hover:bg-purple-500
                    "
                >
                    Send Reminders
                </button>
            </div>

            {/* Robot */}
            <div className="absolute bottom-4 right-4">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl"></div>

                <img
                    src={robot}
                    alt="AI Robot"
                    className="
                    relative h-54 object-contain
                    drop-shadow-[0_0_20px_rgba(124,58,237,0.35)]
                    "
                />
            </div>
        </div>
    );
}