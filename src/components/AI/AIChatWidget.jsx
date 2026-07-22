// src/components/AI/AIChatWidget.jsx
import { useEffect, useRef, useState } from "react";
import { Sparkles, X, SendHorizontal, Maximize2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function nowTime() {
    return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/**
 * Floating launcher shown on every page except /ai itself (MainLayout
 * already handles that exclusion). Clicking the bubble opens a compact
 * chat panel — good for quick questions without leaving the current page.
 * "Expand" jumps to the full /ai page, which has the real 6-tool workspace.
 *
 * Swap the mock reply in handleSend for a real aiService.sendChatMessage()
 * call once your backend /ai/chat endpoint exists — same pattern as
 * AIAssistant.jsx uses.
 */
export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isGenerating]);

    function handleSend() {
        const trimmed = inputValue.trim();
        if (!trimmed || isGenerating) return;

        setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: trimmed, timestamp: nowTime() }]);
        setInputValue("");
        setIsGenerating(true);

        // Mock reply — replace with a real API call when ready.
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "ai",
                    content: "Got it! For the full set of tools (proposals, invoices, reports, and more), open the AI Assistant page.",
                    timestamp: nowTime(),
                },
            ]);
            setIsGenerating(false);
        }, 700);
    }

    function handleExpand() {
        setIsOpen(false);
        navigate("/ai");
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen && (
                <div className="mb-3 flex h-[420px] w-[340px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-violet-600 px-4 py-3">
                        <span className="flex items-center gap-2 text-sm font-semibold text-white">
                            <Sparkles size={15} />
                            AI Assistant
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={handleExpand}
                                className="rounded p-1 text-violet-100 hover:bg-violet-500"
                                aria-label="Open full AI Assistant page"
                            >
                                <Maximize2 size={15} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="rounded p-1 text-violet-100 hover:bg-violet-500"
                                aria-label="Close chat"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                        {messages.length === 0 ? (
                            <p className="mt-8 text-center text-sm text-gray-400">
                                Ask me anything about your projects, clients, or invoices.
                            </p>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-violet-600 text-white" : "bg-violet-50 text-gray-700"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {isGenerating && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl bg-violet-50 px-3 py-2 text-sm text-gray-400">Typing...</div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-2 border-t border-gray-50 p-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask AI anything..."
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={isGenerating || !inputValue.trim()}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Send"
                        >
                            <SendHorizontal size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Launcher bubble */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-violet-700"
                aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
            >
                {isOpen ? <X size={22} /> : <Sparkles size={22} />}
            </button>
        </div>
    );
}