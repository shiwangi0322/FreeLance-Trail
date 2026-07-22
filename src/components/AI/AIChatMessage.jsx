// src/components/AI/AIChatMessage.jsx

/**
 * Renders the two "plain" message types. Structured AI responses (the
 * generated proposal/summary/email/report/invoice/meeting-notes cards) are
 * rendered separately by AIResultCard — this component only handles a
 * user's typed prompt and a short AI text reply that precedes the card.
 */
export default function AIChatMessage({ role, content, timestamp }) {
    const isUser = role === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isUser ? "bg-violet-600 text-white" : "bg-violet-50 text-gray-700"
                    }`}
            >
                <p>{content}</p>
                {timestamp && (
                    <span className={`mt-1 block text-[11px] ${isUser ? "text-violet-200" : "text-gray-400"}`}>
                        {timestamp}
                    </span>
                )}
            </div>
        </div>
    );
}