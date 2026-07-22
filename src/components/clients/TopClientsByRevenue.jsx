// src/components/clients/TopClientsByRevenue.jsx

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Shows the top N clients sorted by totalSpent, descending.
 * Reuses each client's existing avatar/initial + color so it stays visually
 * consistent with the card grid above.
 */
export default function TopClientsByRevenue({ clients = [], limit = 5, onViewAll }) {
    const top = [...clients].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Top Clients by Revenue</h3>
                <button type="button" onClick={onViewAll} className="text-xs font-medium text-violet-600 hover:text-violet-700">
                    View all
                </button>
            </div>

            <ul className="mt-3 space-y-3">
                {top.map((client) => (
                    <li key={client.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-700">
                            <span
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold text-white"
                                style={{ backgroundColor: client.avatarColor }}
                            >
                                {client.initials}
                            </span>
                            {client.name}
                        </span>
                        <span className="font-medium text-gray-900">{formatCurrency(client.totalSpent)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}