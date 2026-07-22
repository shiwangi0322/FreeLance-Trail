// src/pages/Invoices.jsx
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Plus, Receipt, Wallet, Clock, AlertTriangle, ChevronDown } from "lucide-react";

import InvoiceStatCard from "../components/invoices/InvoiceStatCard";
import InvoiceListItem from "../components/invoices/InvoiceListItem";
import InvoiceDetailPanel from "../components/invoices/InvoiceDetailPanel";


// Swap for invoiceService.getAll() once wired to your API — kept static
// here so the page renders standalone. See mockInvoices.example.js.
import { mockInvoices } from "../data/mockInvoices.example";

const TABS = [
    { key: "all", label: "All Invoices" },
    { key: "paid", label: "Paid" },
    { key: "pending", label: "Pending" },
    { key: "overdue", label: "Overdue" },
    { key: "draft", label: "Draft" },
];

const PAGE_SIZE = 8;

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

// Derives each stat card's headline number straight from the invoice list,
// so the totals can never drift out of sync with what's actually in `all`.
function computeStats(invoices) {
    const paid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0);
    const pending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0);
    const overdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0);
    return { total: invoices.length, paid, pending, overdue };
}

export default function Invoices() {
    const [invoices, setInvoices] = useState(mockInvoices);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [page, setPage] = useState(1);
    const [selectedId, setSelectedId] = useState(mockInvoices[0]?.id ?? null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = computeStats(invoices);

    const tabCounts = {
        all: invoices.length,
        paid: invoices.filter((i) => i.status === "paid").length,
        pending: invoices.filter((i) => i.status === "pending").length,
        overdue: invoices.filter((i) => i.status === "overdue").length,
        draft: invoices.filter((i) => i.status === "draft").length,
    };

    const filteredInvoices = useMemo(() => {
        let result = invoices;

        if (activeTab !== "all") result = result.filter((i) => i.status === activeTab);

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter(
                (i) => i.number.toLowerCase().includes(q) || i.client.name.toLowerCase().includes(q)
            );
        }

        const sorted = [...result].sort((a, b) => {
            if (sortBy === "newest") return new Date(b.issueDate) - new Date(a.issueDate);
            if (sortBy === "oldest") return new Date(a.issueDate) - new Date(b.issueDate);
            if (sortBy === "highest") return b.total - a.total;
            if (sortBy === "lowest") return a.total - b.total;
            return 0;
        });

        return sorted;
    }, [invoices, activeTab, searchTerm, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
    const pageInvoices = filteredInvoices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const selectedInvoice = invoices.find((i) => i.id === selectedId) ?? null;

    function handleTabChange(key) {
        setActiveTab(key);
        setPage(1);
    }

    function handleMarkAsPaid(invoice) {
        setInvoices((prev) =>
            prev.map((i) => (i.id === invoice.id ? { ...i, status: "paid", amountPaid: i.total } : i))
        );
    }

    function handleSendReminder(invoice) {
        // Swap for invoiceService.sendReminder(invoice.id) once wired to the API.
        alert(`Reminder sent to ${invoice.client.name} for ${invoice.number}`);
    }

    function handleModalSubmit(data) {
        setInvoices((prev) => [...prev, { ...data, id: Date.now() }]);
        setIsModalOpen(false);
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-end gap-2">
                <div className="relative">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search invoices..."
                        className="rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                </div>

                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <SlidersHorizontal size={16} />
                    Filter
                </button>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                    <Plus size={16} />
                    New Invoice
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InvoiceStatCard
                    icon={Receipt}
                    iconBg="#EDE9FE"
                    iconColor="#8B5CF6"
                    label="Total Invoices"
                    value={stats.total}
                    trend={12}
                />
                <InvoiceStatCard
                    icon={Wallet}
                    iconBg="#D1FAE5"
                    iconColor="#059669"
                    label="Paid"
                    value={formatCurrency(stats.paid)}
                    trend={18}
                />
                <InvoiceStatCard
                    icon={Clock}
                    iconBg="#FEF3C7"
                    iconColor="#D97706"
                    label="Pending"
                    value={formatCurrency(stats.pending)}
                    trend={-6}
                />
                <InvoiceStatCard
                    icon={AlertTriangle}
                    iconBg="#FEE2E2"
                    iconColor="#DC2626"
                    label="Overdue"
                    value={formatCurrency(stats.overdue)}
                    trend={-9}
                />
            </div>

            {/* Main grid: invoice list (left) + detail panel (right) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* List panel */}
                <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-2">
                    <div className="flex flex-wrap gap-1 border-b border-gray-50 pb-3 text-sm">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => handleTabChange(tab.key)}
                                className={`rounded-lg px-2.5 py-1.5 font-medium transition-colors ${activeTab === tab.key ? "bg-violet-50 text-violet-700" : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {tab.label} ({tabCounts[tab.key]})
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Sort by:</span>
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none rounded-lg border border-gray-200 py-1.5 pl-3 pr-7 text-xs font-medium text-gray-700 outline-none focus:border-violet-400"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="highest">Highest Amount</option>
                                <option value="lowest">Lowest Amount</option>
                            </select>
                            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        {pageInvoices.map((invoice) => (
                            <InvoiceListItem
                                key={invoice.id}
                                invoice={invoice}
                                isSelected={invoice.id === selectedId}
                                onSelect={(inv) => setSelectedId(inv.id)}
                            />
                        ))}

                        {pageInvoices.length === 0 && (
                            <p className="py-6 text-center text-sm text-gray-400">No invoices match your search.</p>
                        )}
                    </div>

                    {filteredInvoices.length > 0 && (
                        <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-xs text-gray-500">
                            <span>
                                Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredInvoices.length)} of{" "}
                                {filteredInvoices.length}
                            </span>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .slice(0, 5)
                                    .map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPage(p)}
                                            className={`h-7 w-7 rounded-lg font-medium ${p === page ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-3">
                    <InvoiceDetailPanel
                        invoice={selectedInvoice}
                        onMarkAsPaid={handleMarkAsPaid}
                        onSendReminder={handleSendReminder}
                    />
                </div>
            </div>

            {isModalOpen && (
                <InvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} />
            )}
        </div>
    );
}