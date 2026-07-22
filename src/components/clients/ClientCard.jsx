// src/components/clients/ClientCard.jsx
import { MoreVertical } from "lucide-react";
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_STYLES } from "../../constants/clientStatus";

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Purely presentational, same pattern as before: no API calls here.
 * Clients.jsx owns data-fetching/mutations and passes callbacks down, so
 * this stays reusable elsewhere (e.g. a "select client" picker) later.
 */
export default function ClientCard({ client, onEdit, onDelete, onOpenMenu }) {
    const styles = CLIENT_STATUS_STYLES[client.status] ?? CLIENT_STATUS_STYLES.active;

    return (
        <div className="group relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
                <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold text-white"
                    style={{ backgroundColor: client.avatarColor }}
                >
                    {client.initials}
                </span>

                <button
                    type="button"
                    onClick={() => onOpenMenu?.(client)}
                    className="rounded p-1 text-gray-300 opacity-0 transition-opacity hover:bg-gray-50 hover:text-gray-500 group-hover:opacity-100"
                    aria-label={`More options for ${client.name}`}
                >
                    <MoreVertical size={16} />
                </button>
            </div>

            <h3 className="mt-3 truncate text-sm font-semibold text-gray-900">{client.name}</h3>
            <p className="truncate text-xs text-gray-400">{client.email}</p>

            <div className="mt-4 flex items-center justify-between text-xs">
                <div>
                    <p className="font-semibold text-gray-900">{client.projectsCount}</p>
                    <p className="text-gray-400">{client.projectsCount === 1 ? "Project" : "Projects"}</p>
                </div>
                <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(client.totalSpent)}</p>
                    <p className="text-gray-400">Total Spent</p>
                </div>
            </div>

            <span className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                {CLIENT_STATUS_LABELS[client.status] ?? client.status}
            </span>

            {/* Hidden action buttons — surfaced via onOpenMenu in a real dropdown, kept here so edit/delete are reachable */}
            <div className="sr-only">
                <button type="button" onClick={() => onEdit?.(client)}>Edit</button>
                <button type="button" onClick={() => onDelete?.(client)}>Delete</button>
            </div>
        </div>
    );
}