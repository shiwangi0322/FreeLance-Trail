// src/pages/Clients.jsx
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Plus } from "lucide-react";

import ClientCard from "../components/clients/ClientCard";
import ClientOverviewDonut from "../components/clients/ClientOverviewDonut";
import TopClientsByRevenue from "../components/clients/TopClientsByRevenue";
import RecentlyAddedClients from "../components/clients/RecentlyAddedClients";
import ClientGrowthChart from "../components/clients/ClientGrowthChart";

// Swap for clientService.getAll() once wired to your API — kept static here
// so the page renders standalone. See mockClients.example.js for the shape.
import { mockClients, mockClientGrowth } from "../data/mockClients.example";

const FILTERS = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "new", label: "New This Month" },
];

const PAGE_SIZE = 8;

function isThisMonth(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

export default function Clients() {
    const [clients, setClients] = useState(mockClients);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const filteredClients = useMemo(() => {
        let result = clients;

        if (activeFilter === "active") result = result.filter((c) => c.status === "active");
        if (activeFilter === "inactive") result = result.filter((c) => c.status === "inactive");
        if (activeFilter === "new") result = result.filter((c) => isThisMonth(c.addedDate));

        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter(
                (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
            );
        }

        return result;
    }, [clients, activeFilter, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
    const pageClients = filteredClients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const filterCounts = {
        all: clients.length,
        active: clients.filter((c) => c.status === "active").length,
        inactive: clients.filter((c) => c.status === "inactive").length,
        new: clients.filter((c) => isThisMonth(c.addedDate)).length,
    };

    function handleFilterChange(key) {
        setActiveFilter(key);
        setPage(1);
    }

    function handleOpenCreate() {
        setEditingClient(null);
        setIsModalOpen(true);
    }

    function handleOpenMenu(client) {
        // Swap this for a real dropdown (edit/delete) — wired straight to edit for now.
        setEditingClient(client);
        setIsModalOpen(true);
    }

    // Swap for clientService.create/update once ClientModal's onSubmit is
    // connected to the real API — local state keeps the page usable before that.
    function handleModalSubmit(data) {
        setClients((prev) => {
            if (editingClient) {
                return prev.map((c) => (c.id === editingClient.id ? { ...c, ...data } : c));
            }
            return [...prev, { ...data, id: Date.now(), addedDate: new Date().toISOString() }];
        });
        setIsModalOpen(false);
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex justify-end gap-2">
                <div className="relative">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search clients..."
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
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                    <Plus size={16} />
                    Add Client
                </button>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.key}
                        type="button"
                        onClick={() => handleFilterChange(filter.key)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${activeFilter === filter.key
                                ? "bg-violet-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {filter.label} ({filterCounts[filter.key]})
                    </button>
                ))}
            </div>

            {/* Main grid: client cards (left, wide) + sidebar (right) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {pageClients.map((client) => (
                            <ClientCard key={client.id} client={client} onOpenMenu={handleOpenMenu} />
                        ))}
                    </div>

                    {filteredClients.length === 0 && (
                        <p className="mt-6 text-center text-sm text-gray-400">No clients match your search.</p>
                    )}

                    {filteredClients.length > 0 && (
                        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                            <span>
                                Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredClients.length)} of{" "}
                                {filteredClients.length} clients
                            </span>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPage(p)}
                                        className={`h-8 w-8 rounded-lg text-sm font-medium ${p === page ? "bg-violet-600 text-white" : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6 lg:col-span-1">
                    <ClientOverviewDonut clients={clients} />
                    <TopClientsByRevenue clients={clients} />
                    <RecentlyAddedClients clients={clients} />
                    <ClientGrowthChart growthData={mockClientGrowth} />
                </div>
            </div>

            {isModalOpen && (
                <ClientModal
                    isOpen={isModalOpen}
                    client={editingClient}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleModalSubmit}
                />
            )}
        </div>
    );
}