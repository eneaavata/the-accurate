import { KPICards } from '@/components/screens/dashboard/kpi-cards';
import { SalesTrendChart } from '@/components/screens/dashboard/sales-chart';
import { InventoryChart } from '@/components/screens/dashboard/inventory-chart';
import { RecentActivities } from '@/components/screens/dashboard/recent-activities';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesTrendChart />
        <InventoryChart />
      </div>

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  );
}
