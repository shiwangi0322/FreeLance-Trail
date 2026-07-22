// src/constants/aiActions.js
import { Sparkles, FileText, Mail, BarChart3, Receipt, ClipboardList } from "lucide-react";

// Single source of truth for the 6 quick-action tiles + the icon shown in
// the chat header once a tool is active. `resultType` tells AIResultCard
// which card layout to render for that tool's response.
export const AI_ACTIONS = [
    {
        key: "proposal",
        label: "Generate Proposal",
        description: "Create professional proposals in seconds.",
        icon: Sparkles,
        iconBg: "#EDE9FE",
        iconColor: "#7C3AED",
        resultType: "proposal",
    },
    {
        key: "summarize",
        label: "Summarize Document",
        description: "Get key insights and summaries instantly.",
        icon: FileText,
        iconBg: "#DBEAFE",
        iconColor: "#2563EB",
        resultType: "summary",
    },
    {
        key: "email",
        label: "Write Client Email",
        description: "Draft personalized emails that make an impact.",
        icon: Mail,
        iconBg: "#D1FAE5",
        iconColor: "#059669",
        resultType: "email",
    },
    {
        key: "report",
        label: "Project Report",
        description: "Generate detailed project reports and updates.",
        icon: BarChart3,
        iconBg: "#FEF3C7",
        iconColor: "#D97706",
        resultType: "report",
    },
    {
        key: "invoice",
        label: "Create Invoice",
        description: "Create accurate invoices in seconds.",
        icon: Receipt,
        iconBg: "#FEE2E2",
        iconColor: "#DC2626",
        resultType: "invoice",
    },
    {
        key: "meeting_notes",
        label: "Meeting Notes",
        description: "Generate meeting notes and action items.",
        icon: ClipboardList,
        iconBg: "#E0E7FF",
        iconColor: "#4F46E5",
        resultType: "meeting_notes",
    },
];

export function getActionByKey(key) {
    return AI_ACTIONS.find((a) => a.key === key);
}