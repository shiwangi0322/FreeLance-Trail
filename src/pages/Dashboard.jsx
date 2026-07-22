import { IndianRupee, FolderKanban, Receipt, Sparkles } from "lucide-react";

import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import InvoiceStatusDonut from "../components/dashboard/InvoiceStatusDonut";
import RecentActivity from "../components/dashboard/RecentActivity";
import TopProjects from "../components/dashboard/TopProjects";
import UpcomingSchedule from "../components/dashboard/UpcomingSchedule";
import AIInsightCard from "../components/dashboard/AIInsightCard";
import QuickActionMini from "../components/dashboard/QuickActionMini";
import { showToast } from "../components/common/Toast";

import {
    mockStats,
    mockSparklines,
    mockRevenueData,
    mockInvoiceStatus,
    mockRecentActivity,
    mockTopProjects,
    mockUpcomingSchedule,
} from "../data/mockData";

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
|
| IMPORTANT: this file renders ONLY dashboard content — no page title,
| no search bar, no theme toggle, no "+ New" button. All of that lives
| in Header.jsx (rendered once by MainLayout, above the <Outlet /> that
| shows this page).
|
| NOTE: props passed to StatCard and InvoiceStatusDonut below match
| YOUR actual customized versions of those components, not a generic
| API — specifically:
|   StatCard:          title (not label), change (a formatted STRING
|                       like "+18.6%", not an object), trend as the
|                       plain string "up"/"down"
|   InvoiceStatusDonut: data (not statuses)
|
| Layout, top to bottom:
|   1. StatCard × 4 (with sparklines)
|   2. RevenueChart (2/3) + InvoiceStatusDonut (1/3)
|   3. Three equal columns:
|        RecentActivity | TopProjects | UpcomingSchedule + AIInsightCard + QuickActionMini (stacked)
|
*/

export default function Dashboard() {
    function handleSendReminders() {
        // TODO(once backend exists): call a real bulk-remind endpoint.
        showToast.success("Reminders sent for all overdue invoices (mock)");
    }

    return (
        <div className="flex flex-col gap-6">
            {/* 1. Stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value="₹24.8L"
                    change="+18.6%"
                    trend="up"
                    icon={IndianRupee}
                    iconBg="bg-purple-100 dark:bg-purple-500/15"
                    iconText="text-purple-600 dark:text-purple-400"
                    sparklineData={mockSparklines.revenue}
                    sparklineColor="#7c3aed"
                />
                <StatCard
                    title="Active Projects"
                    value={mockStats.totalProjects}
                    change="+12.3%"
                    trend="up"
                    icon={FolderKanban}
                    iconBg="bg-emerald-100 dark:bg-emerald-500/15"
                    iconText="text-emerald-600 dark:text-emerald-400"
                    sparklineData={mockSparklines.projects}
                    sparklineColor="#10b981"
                />
                <StatCard
                    title="Pending Invoices"
                    value={12}
                    subtitle="₹8,40,000 total"
                    icon={Receipt}
                    iconBg="bg-orange-100 dark:bg-orange-500/15"
                    iconText="text-orange-600 dark:text-orange-400"
                    sparklineData={mockSparklines.invoices}
                    sparklineColor="#f97316"
                />
                <StatCard
                    title="AI Proposals"
                    value={18}
                    change="+3 this month"
                    trend="up"
                    icon={Sparkles}
                    iconBg="bg-blue-100 dark:bg-blue-500/15"
                    iconText="text-blue-600 dark:text-blue-400"
                    sparklineData={mockSparklines.proposals}
                    sparklineColor="#3b82f6"
                />
            </div>

            {/* 2. Revenue chart + Invoice status donut */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RevenueChart data={mockRevenueData} total="₹24,80,000" changePercent={18.6} />
                </div>
                <InvoiceStatusDonut data={mockInvoiceStatus} />
            </div>

            {/* 3. Three-column row: Activity | Top Projects | Schedule stack */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <RecentActivity activities={mockRecentActivity} />
                <TopProjects projects={mockTopProjects} />
                <div className="flex flex-col gap-4">
                    <UpcomingSchedule events={mockUpcomingSchedule} />
                    <AIInsightCard
                        overdueCount={mockStats.overdueCount}
                        overdueAmount={mockStats.overdueAmount.toLocaleString("en-IN")}
                        onSendReminders={handleSendReminders}
                    />
                    <QuickActionMini />
                </div>
            </div>
        </div>
    );
}