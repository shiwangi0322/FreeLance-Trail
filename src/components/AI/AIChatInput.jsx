import { useState, useRef } from "react";
import { Send } from "lucide-react";

/*
|--------------------------------------------------------------------------
| AIChatInput
|--------------------------------------------------------------------------
|
| Text input for the chat, shared by both AIChatWidget (floating popup)
| and AIAssistant (full page). A plain <input> would work, but a
| <textarea> that auto-grows lets people paste in longer project
| descriptions without the text getting clipped/scrolled inside a
| single line.
|
| Keyboard behavior:
|   Enter        → send
|   Shift+Enter  → newline (standard chat-app convention)
|
| Props:
|   onSend    — called with the trimmed text when sending
|   isSending — disables input + button while a reply is in flight
|
*/

export default function AIChatInput({ onSend, isSending = false }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef(null);

    function handleSend() {
        if (!value.trim() || isSending) return;
        onSend(value);
        setValue("");
        // Reset height after clearing, otherwise the textarea stays tall
        // from the previous (now-cleared) content.
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function handleChange(e) {
        setValue(e.target.value);
        // Auto-grow: reset to auto first so shrinking (e.g. after deleting
        // text) works too, not just growing.
        e.target.style.height = "auto";
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    }

    return (
        <div className="flex items-end gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
            <textarea
                ref={textareaRef}
                rows={1}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                placeholder="Ask anything about your projects, invoices, or clients..."
                className="max-h-30 flex-1 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
                type="button"
                onClick={handleSend}
                disabled={!value.trim() || isSending}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-600 text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <Send size={16} />
            </button>
        </div>
    );
}