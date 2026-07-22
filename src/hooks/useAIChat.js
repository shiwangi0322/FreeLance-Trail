import { useState } from "react";
import aiService from "../services/aiService";

/*
|--------------------------------------------------------------------------
| useAIChat
|--------------------------------------------------------------------------
|
| Owns all chat state so both AIAssistant.jsx (full page) and
| AIChatWidget.jsx (floating popup) can share identical chat behavior
| without duplicating logic. Each consumer creates its OWN instance of
| this hook though — the widget and the full page do NOT share the same
| conversation by default, since a hook call creates local state, not a
| global store. If you want the floating widget and the full-page
| assistant to show the SAME ongoing conversation, that would need to
| move into a Zustand store (aiStore.js) instead — flagging this now
| since it's a common surprise.
|
| Returns:
|   messages    — array of { role: "user" | "assistant", content }
|   isSending   — true while waiting for a reply
|   sendMessage — call with the user's text to send it
|   clearChat   — resets the conversation
|
*/

export function useAIChat() {
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);

    async function sendMessage(text) {
        if (!text.trim()) return;

        const userMessage = { role: "user", content: text.trim() };
        // Add the user's message immediately (optimistic) so the UI feels
        // responsive while waiting for the reply.
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsSending(true);

        try {
            const { reply } = await aiService.sendMessage(updatedMessages);
            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
        } catch (err) {
            // Show the error AS a message in the conversation, rather than a
            // toast — keeps the failure visible in context, next to the
            // question that caused it, instead of a toast that disappears.
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong processing that. Please try again.",
                    isError: true,
                },
            ]);
        } finally {
            setIsSending(false);
        }
    }

    function clearChat() {
        setMessages([]);
    }

    return { messages, isSending, sendMessage, clearChat };
}