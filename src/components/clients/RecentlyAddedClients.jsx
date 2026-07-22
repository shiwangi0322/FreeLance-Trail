// src/components/clients/RecentlyAddedClients.jsx

function formatAddedDate(dateStr) {
    const date = new Date(dateStr);
    return `Added on ${date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}`;
}

/**
 * Shows the N most recently added clients, newest first.
 */
export default function RecentlyAddedClients({ clients = [], limit = 3, onViewAll }) {
    const recent = [...clients]
        .sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate))
        .slice(0, limit);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Recently Added Clients</h3>
                <button type="button" onClick={onViewAll} className="text-xs font-medium text-violet-600 hover:text-violet-700">
                    View all
                </button>
            </div>

            <ul className="mt-3 space-y-3">
                {recent.map((client) => (
                    <li key={client.id} className="flex items-center gap-3 text-sm">
                        <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold text-white"
                            style={{ backgroundColor: client.avatarColor }}
                        >
                            {client.initials}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate font-medium text-gray-900">{client.name}</p>
                            <p className="text-xs text-gray-400">{formatAddedDate(client.addedDate)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}