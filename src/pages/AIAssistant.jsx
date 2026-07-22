// src/pages/AIAssistant.jsx
import { useEffect, useRef, useState } from "react";
import { Plus, History, Paperclip, Mic, SendHorizontal, Sparkles, ChevronDown } from "lucide-react";

import AIQuickActions from "../components/AI/AIQuickActions";
import AIChatMessage from "../components/AI/AIChatMessage";
import AIResultCard from "../components/AI/AIResultCard";
import AIContextSidebar from "../components/AI/AIContextSidebar";
import { AI_ACTIONS, getActionByKey } from "../constants/aiActions";

// Swap these three for real aiService.js calls once wired up — kept static
// so the page works standalone. See mockAIAssistant.example.js for shapes.
import {
    mockDefaultContext,
    mockResultData,
    mockPromptByAction,
    mockReplyByAction,
} from "../data/mockAIAssistant.example";

function nowTime() {
    return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function AIAssistant() {
    const [activeAction, setActiveAction] = useState(null); // null = empty state showing tile grid
    const [messages, setMessages] = useState([]); // { id, role: 'user'|'ai'|'result', content?, resultType?, data? }
    const [inputValue, setInputValue] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isGenerating]);

    // Selecting a tile seeds the conversation with that tool's example prompt
    // and immediately "generates" its mock result — swap the setTimeout below
    // for the real aiService call (e.g. aiService.generateProposal(...)).
    function handleSelectAction(action) {
        setActiveAction(action);
        const prompt = mockPromptByAction[action.key];
        runGeneration(action, prompt);
    }

    function runGeneration(action, prompt) {
        setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: prompt, timestamp: nowTime() }]);
        setIsGenerating(true);

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "ai", content: mockReplyByAction[action.key], timestamp: nowTime() },
                { id: Date.now() + 2, role: "result", resultType: action.resultType, data: mockResultData[action.resultType] },
            ]);
            setIsGenerating(false);
        }, 900);
    }

    function handleSend() {
        if (!inputValue.trim() || !activeAction) return;
        runGeneration(activeAction, inputValue.trim());
        setInputValue("");
    }

    function handleNewChat() {
        setActiveAction(null);
        setMessages([]);
        setInputValue("");
    }

    const ActiveIcon = activeAction?.icon ?? Sparkles;
    const showEmptyState = !activeAction && messages.length === 0;

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Main chat column */}
            <div className="flex flex-col lg:col-span-3">
                {/* Toolbar */}
                <div className="mb-4 flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={handleNewChat}
                        className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                    >
                        <Plus size={15} />
                        New Chat
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <History size={15} />
                        Chat History
                    </button>
                </div>

                <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
                    {/* Active tool indicator */}
                    {activeAction && (
                        <div className="flex items-center gap-2 border-b border-gray-50 px-4 py-3">
                            <span
                                className="flex h-6 w-6 items-center justify-center rounded-md"
                                style={{ backgroundColor: activeAction.iconBg, color: activeAction.iconColor }}
                            >
                                <ActiveIcon size={13} />
                            </span>
                            <span className="text-sm font-medium text-gray-700">{activeAction.label}</span>
                            <ChevronDown size={14} className="text-gray-300" />
                        </div>
                    )}

                    {/* Body: quick actions OR chat thread */}
                    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" style={{ maxHeight: 560 }}>
                        {showEmptyState ? (
                            <AIQuickActions onSelect={handleSelectAction} />
                        ) : (
                            <>
                                {messages.map((msg) =>
                                    msg.role === "result" ? (
                                        <div key={msg.id} className="flex justify-start">
                                            <AIResultCard resultType={msg.resultType} data={msg.data} />
                                        </div>
                                    ) : (
                                        <AIChatMessage key={msg.id} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
                                    )
                                )}
                                {isGenerating && (
                                    <div className="flex justify-start">
                                        <div className="rounded-2xl bg-violet-50 px-4 py-2.5 text-sm text-gray-400">AI is typing...</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Input bar */}
                    <div className="flex items-center gap-2 border-t border-gray-50 p-4">
                        <button type="button" className="rounded-lg p-2 text-gray-400 hover:bg-gray-50" aria-label="Attach file">
                            <Paperclip size={16} />
                        </button>
                        <button type="button" className="rounded-lg p-2 text-gray-400 hover:bg-gray-50" aria-label="Voice input">
                            <Mic size={16} />
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask AI anything about your projects..."
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!activeAction}
                            className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Send"
                        >
                            <SendHorizontal size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Context sidebar */}
            <div className="lg:col-span-1">
                <AIContextSidebar
                    context={mockDefaultContext}
                    onSuggestionClick={(s) => {
                        const match = AI_ACTIONS.find((a) => s.label.toLowerCase().includes(a.key.split("_")[0]));
                        if (match) handleSelectAction(match);
                    }}
                    onQuickActionClick={(qa) => {
                        const match = getActionByKey(qa.id) ?? AI_ACTIONS.find((a) => a.label === qa.label);
                        if (match) handleSelectAction(match);
                    }}
                />
            </div>
        </div>
    );
}